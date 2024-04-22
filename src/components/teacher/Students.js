import React, { useEffect, useState } from 'react';
import TeacherNavbar from './TeacherNavbar';
import '../custom.css';
import DataTable from 'react-data-table-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch , faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation,Link } from "react-router-dom";
import axios from 'axios'
import { useSelector } from "react-redux";

function Students() {

    const [name, setName] = useState('');
    const [studentEmail , setStudentEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rollno, setRollno] = useState('');
    const [std, setStd] = useState('');
    const [section, setSection] = useState('');
    const [studentsData, setStudentsData] = useState([]);
    const [studentnamesearch, setStudentnamesearch] = useState('');
    const [studentEmailsearch, setStudentEmailsearch] = useState('');
    const [searchedStudent , setSearchedStudent] = useState(null);

    const useremail = useSelector((state) => state.user.email);

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStudentsForClassTeachers/${useremail}`)
        .then(response => {
            setStudentsData(response.data.user)
            setStudentnamesearch(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[useremail])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/createStudent', {
                name: name,
                email: studentEmail,
                password: password,
                rollno : rollno,
                cbEmail : useremail,
                std:std,
                section:section
            });

            if(response.data.message === 'Email already exist'){
                alert('Email already given to another Student')
            } 
            else if(response.data.message ==='Student added successfully'){
                alert('Student Created Successfully')
            }
        } catch (error) {
            console.error('Error creating student:', error);
        }
    };

    const updateClassTeacher = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/updateClassTeacher', {
                email: searchedStudent?.email,
                ctEmail : useremail
            });

            if(response.data.message === 'Student added to class successfully'){
                axios.get(`http://localhost:3001/getStudentsForClassTeachers/${useremail}`)
                .then(response => {
                        setStudentsData(response.data.user)
                        setStudentnamesearch(response.data.user);
                        alert('Student added to class successfully')
                        setSearchedStudent(null)
                        setStudentEmailsearch('')
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            } 
            else if(response.data.message === 'This student was deleted by admin'){
                alert('Cannot add this student."This student was deleted"')
            }

        } catch (error) {
            console.error('Error creating teacher:', error);
        }
    }

    const studentSearch = async (e) => {
        e.preventDefault();
        axios.get(`http://localhost:3001/searchStudent/${studentEmailsearch}`)
        .then(response => {
            if(response.data.message === 'Student not found'){
                alert('Student not found')
            } 
            setSearchedStudent(response.data.user)
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    }

    const removeStudent = async (stuEmail) => {

        try {
            const response = await axios.post('http://localhost:3001/removeStudent', {
                email: stuEmail,
            });

            if(response.data.message === 'Student removed successfully'){
                axios.get(`http://localhost:3001/getStudentsForClassTeachers/${useremail}`)
                .then(response => {
                        setStudentsData(response.data.user)
                        setStudentnamesearch(response.data.user);
                        setSearchedStudent(null)
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
                alert('Student removed successfully')
            } 
           
        } catch (error) {
            console.error('Error creating student:', error);
        }
    }

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
            name : "View",
            selector: (row) => (
                <Link to={`/studentView/${row.email}`}>
                  <FontAwesomeIcon icon={faEye} className='pe-1'style={{ color: 'gray' }}/>
                </Link>
              ),
        },
        {
            name : "Remove",
            selector: (row) => (
                <FontAwesomeIcon onClick={()=>{
                    removeStudent(row.email)
                }} icon={faTrash} className='pe-1 text-danger'style={{ color: 'gray' }}/>
              ),
        }
    ]

    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <section>
                <div className='row w-100 justify-content-around'>
                    <div className='text-center col-5'>
                        <div className='border rounded p-3 mb-4' style={{boxShadow:'0px 0px 20px -10px'}}>
                            <h4>Add student to your class :</h4>
                            <div className='d-flex align-items-center justify-content-center w-50 m-auto mb-2'>
                                <input placeholder='Enter Student ID' className='text-center me-2' value={studentEmailsearch} onChange={(e)=>setStudentEmailsearch(e.target.value)}/> 
                                <button className='btn btn-primary' onClick={studentSearch}>Search</button>
                            </div>
                            {
                                searchedStudent !== null && 
                                <>
                                    <p><strong>Name : </strong>{searchedStudent.name}<strong> Rollno : </strong>{searchedStudent.rollno}</p>
                                </>
                            }
                            <button className='btn btn-primary' onClick={updateClassTeacher}>ADD</button>
                        </div>
                        <div className='border rounded p-3' style={{boxShadow:'0px 0px 20px -10px'}}>
                            <h4>Create Student :</h4>
                            <form className='text-start w-50 m-auto' style={{lineHeight:'1.7'}} onSubmit={handleSubmit}>
                                <div>
                                    <p className='m-0'>Name :</p>
                                    <input className='w-100' value={name} onChange={(e)=>setName(e.target.value)}/>
                                </div>
                                <div>
                                    <p className='m-0'>Email :</p>
                                    <input className='w-100' value={studentEmail} onChange={(e)=>setStudentEmail(e.target.value)}/>
                                </div>
                                <div>
                                    <p className='m-0'>Password :</p>
                                    <input className='w-100' value={password} onChange={(e)=>setPassword(e.target.value)} />
                                </div>
                                <div>
                                    <p className='m-0'>Rollno :</p>
                                    <input className='w-100' value={rollno} onChange={(e)=>setRollno(e.target.value)}/>
                                </div>
                                <div className='d-flex justify-content-around align-items-center mt-2'>
                                    <div>
                                        <p className='m-0'>Standard :</p>
                                        <select className='me-2' onChange={(e)=>setStd(e.target.value)}>
                                            <option>LKG</option>
                                            <option>UKG</option>
                                            <option>1</option>
                                            <option>2</option>
                                            <option>3</option>
                                            <option>4</option>
                                            <option>5</option>
                                            <option>6</option>
                                            <option>7</option>
                                            <option>8</option>
                                            <option>9</option>
                                            <option>10</option>
                                            <option>11</option>
                                            <option>12</option>
                                        </select>
                                    </div>
                                    <div>
                                        <p className='m-0'>Section :</p>
                                        <select onChange={(e)=>setSection(e.target.value)}>
                                            <option>A</option>
                                            <option>B</option>
                                            <option>C</option>
                                            <option>D</option>
                                            <option>E</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <button type='submit' className='w-100 btn btn-primary mt-3'>Create</button>
                            </form>
                        </div>
                    </div>
                    <div className='col-6 p-3 teacher-list'>
                        <h3 className='mb-3'>Students List</h3>
                        <div className='d-flex justify-content-start align-items-center w-25 border rounded p-1'>
                            <FontAwesomeIcon icon={faSearch} className='pe-1'style={{ color: 'gray' }}/>
                            <input type='text' className='input text-center teacher-search-box w-75' placeholder='Enter Name' onChange={(e)=>{
                                const filtered = studentnamesearch.filter(row => {
                                    return row.name.toLowerCase().includes(e.target.value.toLowerCase())   
                                })
                                setStudentsData(filtered)
                            }} />
                        </div>
                        <DataTable 
                            columns={columns}
                            data={studentsData}
                            fixedHeader
                            pagination
                        >
                        </DataTable>
                    </div>
                </div>

            </section>
        </>
     );
}

export default Students;