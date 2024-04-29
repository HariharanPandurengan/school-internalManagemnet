import React, { useEffect, useState } from 'react';
import TeacherNavbar from './TeacherNavbar';
import '../custom.css';
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faArrowCircleLeft , faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useParams } from 'react-router-dom';


function StudentView() {

    const { email } = useParams();

    const [studentsData, setStudentsData] = useState([]);
    const [studentnamesearch, setStudentnamesearch] = useState('');
    const [studentEmailsearch, setStudentEmailsearch] = useState('');
    const [searchedStudent , setSearchedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attDetails , setAttDetails] = useState({});

    useEffect(()=>{
        axios.get(`http://localhost:3001/searchStudent/${email}`)
        .then(response => {
            if(response.data.message === 'Student not found'){
                alert('Student not found')
                setStudentsData([])
            } 
            else{
                setStudentsData([response.data.user])
                setSearchedStudent(response.data.user)
            }
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[email])

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    
    let totalDaysInMonth = ''
    totalDaysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    useEffect(()=>{
        axios.post('http://localhost:3001/getInduvidualStuAttendance', {
            month: (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '/' + selectedDate.getFullYear(),
            stuEmail : studentsData.length >= 1 && studentsData[0]?.email?.slice(0, -4)
        })
        .then(response => {
            if(response.data.Attendance){
                setAttDetails(response.data.Attendance)
            }
            else{
                setAttDetails({})
            }
           
        })
        .catch(error => {
            console.error('Error fetching attendance:', error);
        });
    },[studentsData,selectedDate])

    const obj = {
        ctEmail : studentsData[0]?.classTeacher,
        month : (selectedDate.getMonth()+1).toString().padStart(2, '0')+'/'+selectedDate.getFullYear(),
        att : {}
    }

    obj.att[studentsData[0]?.email.slice(0, -4)] = {}
    for (let day = 1; day <= totalDaysInMonth; day++) {
        const dayKey = 'day' + day;
        obj.att[studentsData[0]?.email.slice(0, -4)][dayKey] = '';
    }

    const renderTablebody = (email) => {
        let headers = [];
        for (let day = 1; day <= totalDaysInMonth; day++) {
            const dayKey = 'day' + day;
            headers.push(
                <tr>
                    <td className='border text-center' key={day}><strong>{day.toString().padStart(2, '0')}</strong></td>
                    <td className='border p-1' key={day+'100'}>
                        {
                            attDetails !== null && (attDetails.hasOwnProperty('day1') && attDetails[dayKey])
                        }
                    </td>
                </tr>
              
            );
        }
        return headers;
    };

    let aa = studentsData[0]?.image?.split('\\');
    aa = aa?.slice(3); 
    aa = aa?.join('/');

    const columns = [
        {
            name : "Name",
            selector : row => row.name,
            sortable : true,
        },
        {
            name : "Rollno",
            selector : row => row.rollno
        },
        {
            name : "Email",
            selector : row => row.email
        },
        {
            name : "Created By",
            selector : row => row.createdBy
        },
        {
            name : "Status",
            selector : row => (row.deleted === '1' ? 'Deleted' : 'Active')
        },
    ]
    return ( 
        <>
        <TeacherNavbar></TeacherNavbar>
           <section className='w-75 m-auto text-center'>
                <DataTable 
                    columns={columns}
                    data={studentsData}
                    fixedHeader
                    pagination
                >
                </DataTable>
           </section>
           <hr className='m-0 mt-4'></hr>
           <hr className='mt-1'></hr>
            <section className='mt-5'>
                <>
                    <h3 className='text-center mb-4 text-decoration-underline'>Student Profile</h3>
                    <div className='row justify-content-around align-items-start pb-5 w-100 m-auto p-2'>
                    {
                       studentsData[0]?.studentProfile ? 
                        <div className='col-lg-5 p-3 rounded position-relative mb-4' style={{boxShadow:'0px 0px 20px -5px gray',wordWrap : 'break-word'}}>
                            <div className='stu-tec-img-div'>
                                <img className='w-100 h-100' src={"../"+aa} alt="TeacherImage" />
                            </div>
                            <p className='m-0 mb-2'><strong>Fullname</strong> : {studentsData[0]?.studentProfile.fullname}</p>
                            <p className='m-0 mb-2'><strong>Age</strong> : {studentsData[0]?.studentProfile.age}</p>
                            <p className='m-0 mb-2'><strong>Standard</strong> : {studentsData[0]?.studentProfile.std}</p>
                            <p className='m-0 mb-2'><strong>Section</strong> : {studentsData[0]?.studentProfile.section}</p>
                            <p className='m-0 mb-2'><strong>Gender</strong> : {studentsData[0]?.studentProfile.gender}</p>
                            <p className='m-0 mb-2'><strong>Father Name</strong> : {studentsData[0]?.studentProfile.fatherName}</p>
                            <p className='m-0 mb-2'><strong>Mother Name</strong> : {studentsData[0]?.studentProfile.motherName}</p>
                            <p className='m-0 mb-2'><strong>Current Address</strong> : {studentsData[0]?.studentProfile.currentAddress}</p>
                            <p className='m-0 mb-2'><strong>Premanent Address</strong> : {studentsData[0]?.studentProfile.permanentAddress}</p>
                            <p className='m-0 mb-2'><strong>Father Mobile Number</strong> : {studentsData[0]?.studentProfile.fatherNumber}</p>
                            <p className='m-0 mb-4'><strong>Mother Mobile Number</strong> : {studentsData[0]?.studentProfile.motherNumber}</p>
                            <p className='m-0 mb-2 text-decoration-underline'><strong>Emergency Contact 1</strong></p>
                            <p className='m-0 mb-2'><strong>Name</strong> : {studentsData[0]?.studentProfile.em_name1}</p>
                            <p className='m-0 mb-2'><strong>Relationship</strong> : {studentsData[0]?.studentProfile.em_relationship1}</p>
                            <p className='m-0 mb-4'><strong>Mobile Number</strong> : {studentsData[0]?.studentProfile.em_mobileNumber1}</p>
                            <p className='m-0 mb-2 text-decoration-underline'><strong>Emergency Contact 2</strong></p>
                            <p className='m-0 mb-2'><strong>Name</strong> : {studentsData[0]?.studentProfile.em_name2}</p>
                            <p className='m-0 mb-2'><strong>Relationship</strong> : {studentsData[0]?.studentProfile.em_relationship2}</p>
                            <p className='m-0 mb-2'><strong>Mobile Number</strong> : {studentsData[0]?.studentProfile.em_mobileNumber2}</p>
                        </div>
                        :
                        <h4 className='text-center mb-5'>Student not filled his/her profile</h4>
                    }
                        <div className='text-center col-lg-5 rounded'  style={{boxShadow:'0px 0px 20px -5px gray'}}>
                            {
                                attDetails && 
                                <>
                                    <h3>Attendance</h3>
                                    <DatePicker
                                        selected={selectedDate}
                                        onChange={handleDateChange}
                                        dateFormat="MM/yyyy"
                                        showMonthYearPicker
                                        className='cursor-pointer text-center mb-3'
                                    />
                                    <table className='att-table border m-auto overflow-hidden w-100'>
                                        <tbody>
                                            {
                                                studentsData.length >= 1 && studentsData.map(item => {
                                                    return (
                                                        <>
                                                            <tr>
                                                                <td className='text-center'><strong>Days</strong></td>
                                                                <td className='border'><strong>Status</strong></td>
                                                            </tr>
                                                            {renderTablebody(item.email)}
                                                        </> 
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </table> 
                                </>
                            }
                        </div>
                    </div>
                </> 
           </section>
        </>
     );
}

export default StudentView;