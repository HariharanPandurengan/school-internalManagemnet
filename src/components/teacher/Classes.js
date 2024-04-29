import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import axios from 'axios'
import { useSelector } from "react-redux";
import { useLocation,Link } from "react-router-dom";

function Classes() {
    const useremail = useSelector((state) => state.user.email);
    const [classes,setClasses] = useState(null)
    const [std, setStd] = useState('');
    const [section, setSection] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectStd , setSelectStd] = useState('select')
    const [selectSec , setSelectSec] = useState('select')

    let className = std+' '+section;

    useEffect(()=>{
        axios.get(`http://localhost:3001/getClassforTeacher`)
        .then(response => {
            if(response.data.message !== 'no classes created'){
                setClasses(response.data.classesList)
            }
        })
    },[])

    const createClass = async (e) => {
        e.preventDefault();
        if(std !== '' && section !== ''){
            try {
                const response = await axios.post('http://localhost:3001/createClass', {
                    className: className,
                });
    
                if(response.data.message === 'class already exist'){
                    alert('class already exist')
                } 
                else if(response.data.message ==='Class Created Successfully'){
                    axios.get(`http://localhost:3001/getClassforTeacher`)
                    .then(response => {
                        if(response.data.message !== 'no classes created'){
                            setClasses(response.data.classesList)
                        }
                    })
                    alert('Class Created Successfully')
                }
            } catch (error) {
                console.error('Error creating student:', error);
            }
        }
        else{
            alert('Select Standard and Section to create class')
        }
     
    };

    const filteredClasses = classes ? classes.filter((item) => item.className.toLowerCase().includes(searchTerm.toLowerCase())) : [];

    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <section className='create class d-flex flex-column align-items-center mb-4'>
                <h3>Create a new class :</h3>
                <form onSubmit={createClass} className='text-center'>
                    <div className='d-flex mb-2'>
                        <div>
                            <p className='m-0'>Standard :</p>
                            <select className='me-2 ms-1 me-4' onChange={(e)=>{
                                setStd(e.target.value)
                                setSelectStd(e.target.value)
                                }}>
                                <option disabled>Select</option>
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
                            <p className='m-0 me-1'>Section :</p>
                            <select onChange={(e)=>{
                                setSection(e.target.value)
                                setSelectSec(e.target.value)
                            }}>
                                <option disabled>Select</option>
                                <option>A</option>
                                <option>B</option>
                                <option>C</option>
                                <option>D</option>
                                <option>E</option>
                            </select>
                        </div>
                    </div>
                    <button className='btn btn-primary ms-3'>Create</button>
                </form>
            </section>
            <hr></hr>
            <section className='text-center class-list'>
                <h3>Classes List :</h3>
                {
                    !classes &&
                    <p>No classes created</p>
                }
                {
                    classes && 
                    <select onChange={(e) => setSearchTerm(e.target.value)}>
                           <option value="">All</option>
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
                }
                {
                    filteredClasses.length === 0 && <p className='mt-3'>No classes found</p>
                }
                {
                    filteredClasses.length > 0 && (
                        <div className="row w-100 m-auto justify-content-around">
                            {filteredClasses.map((item) => {
                                return (
                                    <div className='col-lg-4 col-md-5 bg-white px-3' key={item.className}>
                                        <div
                                        key={item.className}
                                        className=" bg-primary rounded p-3 my-2"
                                        style={{ boxShadow: '0px 0px 5px 0px gray', cursor: 'pointer',maxHeight:'150px' }}
                                       >
                                            <Link to={"/teacherClass/"+item.className} key={item.className} className='rounded py-3 px-2'>
                                                <h1 className="m-0 text-white" key={item.className}>{item.className}</h1>
                                            </Link>
                                        
                                        </div>
                                    </div>
                                    
                                );
                            })}
                        </div>
                    )
                }
                
            </section>
        </>
     );
}

export default Classes;