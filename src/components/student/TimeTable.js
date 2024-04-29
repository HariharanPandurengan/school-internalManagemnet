import React, { useEffect, useState } from 'react';
import '../custom.css';
import StudentNavbar from './StudentNavbar';
import { useSelector } from 'react-redux';
import axios from 'axios';

function TimeTable() {
    const useremail = useSelector((state) => state.user.email);

    const[tt,setTt] = useState(null);
    const[ett,setETt] = useState(null);

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStud/${useremail}`)
        .then(response => {  
            if(response.data.user.classTeacher !== '' && response.data.user.classTeacher !== null){
                axios.get(`http://localhost:3001/getTimetable/${response.data.user.classTeacher}`)
                .then(response => {  
                    response.data.tt.length !== 0 && setTt(response.data.tt[0])
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
    
                axios.get(`http://localhost:3001/getEttforTeacher/${response.data.user.classTeacher}`)
                .then(response => {  
                    setETt(response.data.user)
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            }
           
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });

      
    },[useremail])

    useEffect(()=>{
        if (tt !== null) {
            setTimetable(prevState => {
                const updatedTimetable = { ...prevState.timetable };
                for (const key in tt.timetable) {
                    if (key in updatedTimetable) {
                        if (tt.timetable.hasOwnProperty(key) && updatedTimetable.hasOwnProperty(key)) {
                            for (const subKey in tt.timetable[key]) {
                                if (tt.timetable[key].hasOwnProperty(subKey)) {
                                    updatedTimetable[key][subKey] = tt.timetable[key][subKey];
                                }
                            }
                        }
                    }
                }
                return {
                    ...prevState,
                    timetable: updatedTimetable
                };
            });
        }
    },[tt])

    const[timetable,setTimetable] = useState({
        teacherEmail : useremail,
        timetable: {
            Monday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
            Tuesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
            Wednesday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
            Thursday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
            Friday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
            Saturday: { per1: '', per2: '', per3: '', per4: '', per5: '', per6: '', per7: '', per8: '' },
        }
    });
    return ( 
        <>
            <StudentNavbar></StudentNavbar>
            <div className='w-100 text-center'>
                <h3 className='text-decoration-underline mb-3'>Class TimeTable</h3>
                <div className="stu-teacher-tt-div table-container d-flex" style={{ overflowX: 'auto', maxWidth: '100%',position:'relative'}}>
                    <table className='table stu-teacher-tt m-auto' style={{boxShadow:'0px 0px 20px -7px gray'}}>
                        <thead className='w-100'>
                            <tr className='w-100'>
                                <td className='tt-td border'><strong>DAY</strong></td>
                                <td className='tt-td border'><strong>Period 1</strong></td>
                                <td className='tt-td border'><strong>Period 2</strong></td>
                                <td className='tt-td border'><strong>Period 3</strong></td>
                                <td className='tt-td border'><strong>Period 4</strong></td>
                                <td className='tt-td border'><strong>Period 5</strong></td>
                                <td className='tt-td border'><strong>Period 6</strong></td>
                                <td className='tt-td border'><strong>Period 7</strong></td>
                                <td className='tt-td border'><strong>Period 8</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(timetable.timetable).map((day, index) => (
                                <tr key={index}>
                                    <td className='tt-td border'><strong>{day}</strong></td>
                                    {Object.keys(timetable.timetable[day]).map((period, idx) => (
                                        <td key={idx} className='tt-td border'>
                                            <p className='m-0'>{timetable.timetable[day][period]}</p>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            
            </div>
            <div className='mt-5 text-center pb-5'>
                {
                    ett !== null && 
                    <>
                        <h3 className='text-decoration-underline'>{ett.examName} Exam TimeTable</h3>
                        <table className='w-25 m-auto'>
                            <thead>
                                <tr className='border'>
                                    <td className='border'><strong>Subject</strong></td>
                                    <td><strong>Date(yyyy-mm-dd)</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    ett.subDate?.sub1 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub1}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub1} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub2 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub2}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub2} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub3 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub3}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub3} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub4 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub4}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub4} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub5 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub5}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub5} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub6 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub6}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub6} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub7 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub7}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub7} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub8 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub8}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub8} disabled/></td>
                                    </tr>
                                }
                                {
                                    ett.subDate?.sub9 !== '' && 
                                    <tr className='border'>
                                        <td className='p-1 border'>{ett.subName?.sub9}</td>
                                        <td className='p-1'><input value={ett.subDate?.sub9} disabled/></td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                    </>
                }
            </div>
        </>
     );
}

export default TimeTable;