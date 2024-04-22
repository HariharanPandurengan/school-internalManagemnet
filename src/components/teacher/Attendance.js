import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector } from 'react-redux';
import axios from 'axios'
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Attendance() {
    const useremail = useSelector((state) => state.user.email);

    const [studentDet , setStudentDet] = useState(null);
    const [attDetails , setAttDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    let totalDaysInMonth = ''
    totalDaysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStudentsForClassTeachers/${useremail}`)
        .then(response => {  
            setStudentDet(response.data.user)
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[useremail])

    const obj = {
        ctEmail : useremail,
        month : (selectedDate.getMonth()+1).toString().padStart(2, '0')+'/'+selectedDate.getFullYear(),
        att : {}
    }

    console.log(obj)

    studentDet?.map(item => {
        obj.att[item.email.slice(0, -4)] = {}
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayKey = 'day' + day;
            obj.att[item.email.slice(0, -4)][dayKey] = '';
        }
    })

  
    if(attDetails !== null){
        for (let key in attDetails) {
            for (let day = 1; day <= totalDaysInMonth; day++) {
                const dayKey = 'day' + day;
                obj.att[key][dayKey] = attDetails[key][dayKey];
            }
        }
    }

    if(attDetails === null){
        studentDet?.map(item => {
            obj.att[item.email.slice(0, -4)] = {}
            for (let day = 1; day <= totalDaysInMonth; day++) {
                const dayKey = 'day' + day;
                obj.att[item.email.slice(0, -4)][dayKey] = '';
            }
        })
    }

    useEffect(()=>{
        axios.post('http://localhost:3001/getStuAttendance', {
            ctEmail: useremail,
            month: (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '/' + selectedDate.getFullYear()
        })
        .then(response => {
            if(response.data.message !== 'no data'){
                console.log(response.data.user.att)
                setAttDetails(response.data.user.att);
            }
            else{
                setAttDetails(null);
            }
        })
        .catch(error => {
            console.error('Error fetching attendance:', error);
        });
    },[totalDaysInMonth])
    
    const renderTableHeaders = () => {
        let headers = [];
        for (let day = 1; day <= totalDaysInMonth; day++) {
            headers.push(
                <td className='border text-center' key={day}><strong>{day.toString().padStart(2, '0')}</strong></td>
            );
        }
        return headers;
    };

    const renderTablebody = (email) => {
        let headers = [];
        for (let day = 1; day <= totalDaysInMonth; day++) {
            headers.push(
                <td className='border p-1' key={day+''}>
                    <select className={'w-100'} onChange={(e)=>{
                        obj.att[email.slice(0, -4)]['day'+day] = e.target.value
                        }}>
                        <option value='-' ></option>
                        <option value='present' selected={obj.att[email.slice(0, -4)]['day'+day] === 'present' ? true : false}>Present</option>
                        <option value='Absent' selected={obj.att[email.slice(0, -4)]['day'+day] === 'Absent' ? true : false}>Absent</option>
                        <option value='Half day' selected={obj.att[email.slice(0, -4)]['day'+day] === 'Half day' ? true : false}>Half Day</option>
                        <option value='Holiday' selected={obj.att[email.slice(0, -4)]['day'+day] === 'Holiday' ? true : false}>Holiday</option>
                    </select>
                </td>
            );
        }
        return headers;
    };

    const attSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/StuAttendance', obj);
            if(response.data.message === 'Saved Successfully'){
               alert('Saved Successfully')
            }
        } catch (error) {
            console.error('Error getting attendance insertion:', error);
        }
    }

    return ( 
        <>
          <TeacherNavbar />
            <section className='w-100 text-center'>
                <h3>Attendance</h3>
                <div className='mb-4'>
                    <label className='me-2' htmlFor="month">Select Month :</label>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className='cursor-pointer text-center'
                    />
                </div>
                <table className='att-table m-auto overflow-hidden'>
                    <thead className='w-100' style={{border:'2px solid black'}}>
                        <tr className='w-100'>
                            <td className='p-1 border'><strong>Name</strong></td>
                            <td className='p-1 border'><strong>Rollno</strong></td>
                            {renderTableHeaders()}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            studentDet !== null && studentDet.map(item => {
                                return (
                                    <tr>
                                        <td className='border'>{item.name}</td>
                                        <td className='border'>{item.rollno}</td>
                                        {renderTablebody(item.email)}
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table> 
                <button className='btn btn-primary mt-3' onClick={attSave}>Save</button>
            </section>
        </>
     );
}

export default Attendance;