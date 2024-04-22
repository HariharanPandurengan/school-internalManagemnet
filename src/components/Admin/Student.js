import React, { useEffect, useState } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './Navbar';
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faArrowCircleLeft , faTrash } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Student() {
    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);

    const [studentsData, setStudentsData] = useState([]);
    const [studentnamesearch, setStudentnamesearch] = useState('');
    const [studentEmailsearch, setStudentEmailsearch] = useState('');
    const [searchedStudent , setSearchedStudent] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [attDetails , setAttDetails] = useState({});

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const studentSearch = async (e) => {
        e.preventDefault();
        axios.get(`http://localhost:3001/searchStudent/${studentEmailsearch}`)
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
    }

    const deleteStudent = async (stuEmail) => {
        try {
            const response = await axios.post('http://localhost:3001/deleteStudent', {
                email: stuEmail,
            });

            if(response.data.message === 'Student deleted successfully'){
                alert('Student deleted successfully')
                axios.get(`http://localhost:3001/searchStudent/${studentEmailsearch}`)
                .then(response => {
                    if(response.data.message === 'Student not found'){
                        alert('Student not found')
                    } 
                    setStudentsData([response.data.user])
                    setSearchedStudent(response.data.user)
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            } 
           
        } catch (error) {
            console.error('Error creating student:', error);
        }
    }

    const retrieve = async (stuEmail) => {
        try {
            const response = await axios.post('http://localhost:3001/retrieveStudent', {
                email: stuEmail,
            });

            if(response.data.message === 'Student retrieved successfully'){
                alert('Student retrieved successfully')
                axios.get(`http://localhost:3001/searchStudent/${studentEmailsearch}`)
                .then(response => {
                    if(response.data.message === 'Student not found'){
                        alert('Student not found')
                    } 
                    setStudentsData([response.data.user])
                    setSearchedStudent(response.data.user)
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            } 
           
        } catch (error) {
            console.error('Error creating student:', error);
        }
    }
    
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
            name : "Status",
            selector : row => (row.deleted === '1' ? 'Deleted' : 'Active')
        },
        {
            name : "Action",
            selector: (row) => ( row.deleted === '0' ?
                <div style={{cursor:'pointer'}} onClick={()=>{
                    deleteStudent(row.email)
                }}>
                    <FontAwesomeIcon  icon={faTrash} className='pe-1 text-danger'style={{ color: 'gray' }}/>
                    <span>Delete</span>
                </div>
                
                :
                <div style={{cursor:'pointer'}} onClick={()=>{
                    retrieve(row.email)
                }}>
                  <FontAwesomeIcon  icon={faArrowCircleLeft} className='pe-1 text-success'style={{ color: 'gray' }}/>
                <span>Retrieve</span>
                </div>
              ),
        }
    ]

    return ( 
        <>
           <Navbar></Navbar>
           <section className='w-75 m-auto text-center'>
                <h4 className='mb-3'>Search Student</h4>
                <div className='d-flex justify-content-center align-items-center'>
                    <div className='d-flex justify-content-center align-items-center me-3'>
                        <input type='email' placeholder='Enter Email' className='student-search text-center me-2' value={studentEmailsearch} onChange={(e)=>setStudentEmailsearch(e.target.value)} /> 
                        <button className='btn btn-primary p-0 p-1' onClick={studentSearch}>Search</button> 
                    </div>
                </div>
                <DataTable 
                    columns={columns}
                    data={studentsData}
                    fixedHeader
                    pagination
                >
                </DataTable>
           </section>
           <section className='mt-5'>
                <>
                    <h3 className='text-center mb-4'>Student Profile :</h3>
                    <div className='row justify-content-around align-items-start pb-5 w-100'>
                    {
                       studentsData[0]?.studentProfile && 
                        <div className='col-5 p-3 rounded position-relative' style={{boxShadow:'0px 0px 20px -5px gray',wordWrap : 'break-word'}}>
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
                            <div style={{width:'150px',height:'200px',border:'2px solid black',position:'absolute',top:'2%',right:'2%'}}>
                                <img className='w-100 h-100' src={"../"+aa} alt="TeacherImage" />
                            </div>
                        </div>
                    }
                        <div className='text-center col-5 rounded'  style={{boxShadow:'0px 0px 20px -5px gray'}}>
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

export default Student;