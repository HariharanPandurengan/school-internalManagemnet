import React, { useEffect } from 'react';
import '../custom.css';
import { useState } from 'react';
import axios from 'axios'
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import DataTable from 'react-data-table-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch } from '@fortawesome/free-solid-svg-icons';
import { useLocation,Link } from "react-router-dom";
import Navbar from './Navbar';

function Home() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [teacherData, setTeacherData] = useState([]);
    const [teacheremailsearch, setTeacheremailsearch] = useState('');
    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);

    const location = useLocation(); 

    useEffect(()=>{
        axios.get('http://localhost:3001/getTeachers')
        .then(response => {
            setTeacherData(response.data.user)
            setTeacheremailsearch(response.data.user);
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[])

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/createTeacher', {
                name: name,
                email: email,
                password: password
            });

            if(response.data.message === 'Email already exist'){
                alert('Email already taken by other teacher')
            } 
            else if(response.data.message ==='Teacher added successfully'){
                alert('Teacher Created Successfully')
                setName('')
                setEmail('')
                setPassword('')
                axios.get('http://localhost:3001/getTeachers')
                .then(response => {
                    setTeacherData(response.data.user)
                    setTeacheremailsearch(response.data.user);
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            }
        } catch (error) {
            console.error('Error creating teacher:', error);
        }
    };
    const columns = [
        {
            name : "Name",
            selector : row => row.name,
            sortable : true,
        },
        {
            name : "Email",
            selector : row => row.email
        },
        {
            name : "View",
            selector: (row) => (
                <Link to={`/teacherView/${row.email}`}>
                  <FontAwesomeIcon icon={faEye} className='pe-1'style={{ color: 'gray' }}/>
                </Link>
              ),
        }
    ]
    return ( 
        <>
            <Navbar></Navbar>
            
            <section className='admin-sec-1 p-3'>
                <div className='col-4'>
                    <div id="create-teacher" className='p-3'>
                        <h3>Create Teacher</h3>
                        <form onSubmit={handleSubmit}>
                            <div className='d-flex flex-column'>
                                <label htmlFor="name">Name:</label>
                                <input className='input' type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className='d-flex flex-column'>
                                <label htmlFor="email">Email:</label>
                                <input className='input' type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className='d-flex flex-column'>
                                <label htmlFor="password">Password:</label>
                                <input className='input' type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                            <button type="submit" className='btn btn-primary mt-3'>Create Teacher</button>
                        </form>
                    </div>
                </div>
                <div className='col-1'>
                    <div className='line'></div>
                </div>
                <div className='col-6 p-3 teacher-list'>
                    <h3 className='mb-3'>Teachers List</h3>
                    <div className='d-flex justify-content-start align-items-center w-25 border rounded p-1'>
                        <FontAwesomeIcon icon={faSearch} className='pe-1'style={{ color: 'gray' }}/>
                        <input type='text' className='input text-center teacher-search-box w-75' placeholder='Enter Name' onChange={(e)=>{
                            const filtered = teacheremailsearch.filter(row => {
                                console.log(e.target.value.toLowerCase())
                                return row.name.toLowerCase().includes(e.target.value.toLowerCase())   
                            })
                            setTeacherData(filtered)
                        }} />
                    </div>
                    <DataTable 
                        columns={columns}
                        data={teacherData}
                        fixedHeader
                        pagination
                    >
                    </DataTable>
                </div>
            </section>
      
        </>
       
     );
}

export default Home;