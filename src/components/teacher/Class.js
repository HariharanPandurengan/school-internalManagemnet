import React, { useEffect, useState } from 'react';
import TeacherNavbar from './TeacherNavbar';
import '../custom.css';
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import axios from 'axios'
import DataTable from 'react-data-table-component'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faSearch , faTrash } from '@fortawesome/free-solid-svg-icons';
import { useLocation,Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function Class() {
    const { className } = useParams();
    const useremail = useSelector((state) => state.user.email);
    const[cT,setCt] = useState('-non-')
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
    const [attDetails , setAttDetails] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
   

    useEffect(()=>{
        axios.get(`http://localhost:3001/getClassDetailsforTeacher/${className}`)
        .then(response => {
            if(response.data.user.hasOwnProperty('classTeacher')){
                if(response.data.user.classTeacher !== ''){
                    setCt(response.data.user.classTeacher)
                }
            }
        })
        axios.get(`http://localhost:3001/getStudentsForClass/${className}`)
        .then(response => {
                setStudentsData(response.data.user)
                setStudentnamesearch(response.data.user);
                setSearchedStudent(null)
                setStudentEmailsearch('')
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[className])

    const setClassTeacher = async (e) => {
        e.preventDefault();
        
        axios.post('http://localhost:3001/updateClassTeacherforclass', {
            ctEmail : useremail,
            className : className
        })
        .then(response => {
            if(response.data.message === 'Now you are the class teacher'){
                alert('Now you are the class teacher for '+className)
            }
            axios.get(`http://localhost:3001/getClassDetailsforTeacher/${className}`)
            .then(response => {
                if(response.data.user.hasOwnProperty('classTeacher')){
                    if(response.data.user.classTeacher !== ''){
                        setCt(response.data.user.classTeacher)
                    }
                }
            })
            .catch(error => {
                console.error('Error fetching admins:', error);
            });
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }

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

    const updateClassName = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/updateClassNameforStudent', {
                stuEmail: searchedStudent?.email,
                className : className
            });

            if(response.data.message === 'stu class name changed'){
                axios.get(`http://localhost:3001/getStudentsForClass/${className}`)
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
                axios.get(`http://localhost:3001/getStudentsForClass/${className}`)
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

// Attendance functions

    const [obj , setObj] = useState(  
    {
        className : className,
        month : (selectedDate.getMonth()+1).toString().padStart(2, '0')+'/'+selectedDate.getFullYear(),
        att : {}
    })

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    let totalDaysInMonth = ''

    totalDaysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();

    useEffect(()=>{
        studentsData?.map(item => {
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
                    if(obj.att[key]?.hasOwnProperty('day' + day)){
                        obj.att[key][dayKey] = attDetails[key][dayKey];
                    }
                }
            }
        }
    
        if(attDetails === null){
            studentsData?.map(item => {
                obj.att[item.email.slice(0, -4)] = {}
                for (let day = 1; day <= totalDaysInMonth; day++) {
                    const dayKey = 'day' + day;
                    obj.att[item.email.slice(0, -4)][dayKey] = '';
                }
            })
        }
    },[studentsData,attDetails])

  

    useEffect(()=>{
        const preAttPost = [];
        studentsData?.map(item => {
            preAttPost.push(item.email);
        })
        axios.post('http://localhost:3001/getStuAttendance', {
            stuEmails: preAttPost,
            month: (selectedDate.getMonth() + 1).toString().padStart(2, '0') + '/' + selectedDate.getFullYear()
        })
        .then(response => {
          
            if(response.data.message !== 'no data'){
                
                setAttDetails(response.data.user.att);
            }
            else{
                setAttDetails(null);
            }
        })
        .catch(error => {
            console.error('Error fetching attendance:', error);
        });
    },[totalDaysInMonth,studentsData])
    
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
        if(obj.att.hasOwnProperty([email.slice(0, -4)])){
            for (let day = 1; day <= totalDaysInMonth; day++) {
                headers.push(
                    <td className='border p-1' key={day+''}>
                        <select className={''}  onChange={(e)=>{
                                attUpdation(e.target.value,email,day)
                            }} value={Object.keys(obj.att).length !== 0 && obj.att[email.slice(0, -4)]['day'+day]}>
                            <option value='-' ></option>
                            <option value='present'>Present</option>
                            <option value='Absent'>Absent</option>
                            <option value='Morning Only'>Morning Only</option>
                            <option value='Afternoon Only'>Afternoon Only</option>
                            <option value='Holiday'>Holiday</option>
                        </select>
                    </td>
                );
            }
            return headers;
        }
        else{
            let updatedObj = { ...obj }; 
            if(!updatedObj.att.hasOwnProperty(email.slice(0, -4))){
                updatedObj.att[email.slice(0, -4)] = {}
            }
            setObj(updatedObj);
            for (let day = 1; day <= totalDaysInMonth; day++) {
                headers.push(
                    <td className='border p-1' key={day+''}>
                        <select className={''}  onChange={(e)=>{
                                attUpdation(e.target.value,email,day)
                            }} value={Object.keys(obj.att).length !== 0 && obj.att[email.slice(0, -4)]['day'+day]}>
                            <option value='-' ></option>
                            <option value='present'>Present</option>
                            <option value='Absent'>Absent</option>
                            <option value='Morning Only'>Morning Only</option>
                            <option value='Afternoon Only'>Afternoon Only</option>
                            <option value='Holiday'>Holiday</option>
                        </select>
                    </td>
                );
            }
            return headers;
        }
    };

    function attUpdation(value,email,day){
        let updatedObj = { ...obj }; 
        if(!updatedObj.att.hasOwnProperty(email.slice(0, -4))){
            updatedObj.att[email.slice(0, -4)] = {}
        }
        updatedObj.att[email.slice(0, -4)]['day' + day] = value;
        setObj(updatedObj);
    }

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

    // Result functions
    // for results
    const [preResult, setPreResult] = useState(null);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [newCreation, setNewCreation] = useState(false);
    const [resPost, setResPost] = useState(false);
    const [exN,setExN] = useState('')
    const [resultobj, setResultobj] = useState({
        result: {}
    });

   

    useEffect(() => {
        const preResultPost = [];
        studentsData?.map(item => {
            resultobj.result[item.email.slice(0, -4)] = {}
            preResultPost.push(item.email);
        })

        if (preResultPost.length > 0) {
            axios.post('http://localhost:3001/getresultforTeacher', {
                stuEmails: preResultPost
            })
            .then(response => {
                if (response.data.message !== 'Student not found') {
                    setPreResult(response.data.user);
                }
            })
            .catch(error => {
                console.error('Error fetching admins:', error);
            });
        }
    }, [studentsData]);
   

    useEffect(() => { 

        if (newCreation === false) {
            if(preResult !== null){
                const updatedObj = { ...resultobj };

                for (let key in preResult.result) {
                    if (updatedObj.result.hasOwnProperty(key)) {
                        updatedObj.result[key] = preResult.result[key];
    
                       
                    }
                }
                setResultobj(updatedObj);
            }
        }
    }, [newCreation, preResult]);

    const arr = [];
    useEffect(() => {
        if(subjects.length === 0){
            if (newCreation === false) {
                if(preResult !== null){
                    for (let key in preResult.result) {
                        
                        if(arr.length === 0){
                            for (let skey in preResult.result[key]) {
                                if (!(skey === 'total') && !(skey === 'percentage') && !(skey === 'grade')) {
                                    arr.push(skey);
                                }
                            }
                        }
                        
                        setSubjects(arr);
                    }
                }
            }
        }
    }, [preResult]);


    function handleChange(event, email) {
        if(event.target.name === 'examName'){
            const value = event.target.value;
            const updatedObj = { ...obj };
            updatedObj.examName = value;
            setResultobj(updatedObj);
        }
        else{
            const name = event.target.name;
            const value = event.target.value;
            const em = email.slice(0, -4);
    
            const updatedObj = { ...resultobj };
            if(!updatedObj.result.hasOwnProperty(em)){
                updatedObj.result[em] = {}
            }
            updatedObj.result[em][name] = value;
            let total = 0;
            for (let key in updatedObj.result[em]) {
                if (key !== 'total' && key !== 'percentage'  && key !== 'grade') {
                    total += parseInt(updatedObj.result[em][key]);
                }
            }

            let totalsubs = 0;
            for (let key in updatedObj.result[em]) {
                if (key !== 'total' && key !== 'percentage'  && key !== 'grade') {
                    totalsubs += 1;
                }
            }
            updatedObj.result[em]['total'] = total ;
            updatedObj.result[em]['percentage'] = (total / totalsubs).toFixed(2) ;
            setResultobj(updatedObj);
        }
    }


    const submit = async (e) => {
        e.preventDefault();
        try {
            if(exN === '' || exN === null){
                alert('Enter Exam Name')
            }
            else{
                const response = await axios.post('http://localhost:3001/insertUpdateResult', {
                    examName : exN,
                    result : resultobj.result
                });
                if (response.data.message === 'Result Saved Successfully') {
                    alert('Result Saved Successfully');
                    
                    const preResultPost = [];
                    studentsData?.map(item => {
                        preResultPost.push(item.email);
                    })
                    axios.post('http://localhost:3001/getresultforTeacher', {
                    stuEmails: preResultPost
                    })
                    .then(response => {
                        if (response.data.message !== 'Student not found') {
                            setPreResult(response.data.user);
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching admins:', error);
                    });
                }
            }
        } catch (error) {
            console.error('Error getting Teacher Logdata:', error);
        }
    };

    // homework
    const [hw , setHw ] = useState('')
    const [lasthwDate , setLasthwDate] = useState('')
    const currentDate = new Date();

    useEffect(()=>{
        axios.get(`http://localhost:3001/getHomework/${className}`)
        .then(response => {
            if (response.data.message !== 'No hw found' && response.data.hw.length !== 0) {
                setHw(response.data.hw[0].homework)
                setLasthwDate(response.data.hw[0].date)
            }
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[className])

    function saveHW(){
        axios.post('http://localhost:3001/insertUpdateHomework', {
            className : className,
            homework : hw
        })
        .then(response => {
            if (response.data.message === 'hw updated successfully') {
                alert('Home Work Updated Successfully')
            }
            axios.get(`http://localhost:3001/getHomework/${className}`)
            .then(response => {
                if (response.data.message !== 'No hw found' && response.data.hw.length !== 0) {
                    setHw(response.data.hw[0].homework)
                    setLasthwDate(response.data.hw[0].date)
                }
            })
            .catch(error => {
            console.error('Error fetching admins:', error);
            });
        })
        .catch(error => {
            console.error('Error fetching admins:', error);
        });

    }

    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <section className='text-center'>
                <h2 className='m-auto mb-3'>
                    <span className='bg-primary text-white rounded px-2 py-1'>Class : {className}</span>
                </h2>
                <h4>Class Teacher : {cT}</h4>
                <button className='btn btn-primary' onClick={setClassTeacher}>Set me as class teacher</button>
            </section>
            <div className='row w-100 justify-content-around mt-5 m-auto'>
                <div className='text-center col-lg-5 col-sm-7 mb-4'>
                    <div className='border rounded p-3 mb-4' style={{boxShadow:'0px 0px 20px -10px'}}>
                        <h4>Add student to your class :</h4>
                        <div className='d-flex align-items-center justify-content-center w-50 m-auto mb-2'>
                            <input placeholder='Enter Student ID' className='text-center me-2' value={studentEmailsearch} onChange={(e)=>setStudentEmailsearch(e.target.value)}/> 
                            <button className='btn btn-primary' onClick={studentSearch}>Search</button>
                        </div>
                        {
                            searchedStudent !== null && 
                            <>
                                <p><strong>Name : </strong>{searchedStudent?.name}<strong> Rollno : </strong>{searchedStudent?.rollno}</p>
                            </>
                        }
                        <button className='btn btn-primary' onClick={updateClassName}>ADD</button>
                    </div>
                    <div className='border rounded p-3' style={{boxShadow:'0px 0px 20px -10px'}}>
                        <h4>Create Student :</h4>
                        <form className='text-start m-auto create-stu' style={{lineHeight:'1.7'}} onSubmit={handleSubmit}>
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
                <div className='col-lg-6'>
                    <div className='teacher-list p-3'>
                        <h3 className='mb-3'>Students List</h3>
                        <div className='d-flex justify-content-start align-items-center  border rounded p-1'>
                            <FontAwesomeIcon icon={faSearch} className='pe-1'style={{ color: 'gray' }}/>
                            <input type='text' className='input text-center teacher-search-box w-75' placeholder='Enter Name' onChange={(e)=>{
                                const filtered = studentnamesearch.filter(row => {
                                    return row.name.toLowerCase().includes(e.target.value.toLowerCase())   
                                })
                                setStudentsData(filtered)
                            }} />
                        </div>
                        <div className='bg-danger text-white rounded mt-3 p-2 overflow-hidden'>
                            <h4>!Note</h4>
                            <p className='m-0'>If you <strong>'remove'</strong> a student from this class his/her latest result data will delete</p>
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
            </div>

            {/* Attendance */}

            <section className='w-100 text-center mt-5 py-4 class-att'>
                <h2 className='text-decoration-underline text-white' style={{textShadow:'0px 0px 3px black'}}>Attendance</h2>
                <div className='mb-4'>
                    <label className='me-2 text-white' htmlFor="month">Select Month :</label>
                    <DatePicker 
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="MM/yyyy"
                        showMonthYearPicker
                        className='cursor-pointer text-center'
                    />
                </div>
                <div className="table-container mx-2 d-flex" style={{ overflowX: 'auto', maxWidth: '100%',position:'relative'}}>
                    <table className='att-table m-auto overflow-hidden bg-white h-100' style={{position:"sticky",left:'0',maxWidth:'10%',height:'100% !important'}}>
                        <thead style={{border:'2px solid black'}}>
                            <tr>
                                <td className='px-1 border'><strong>Name</strong></td>
                                <td className='px-1 border'><strong>Rollno</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentsData !== null && studentsData.map(item => {
                                    return (
                                        <tr key={item.name}>
                                            <td className='border p-1'>{item.name}</td>
                                            <td className='border p-1'><select disabled><option>{item.rollno}</option></select></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                    <table className='att-table m-auto overflow-hidden bg-white'>
                        <thead style={{border:'2px solid black',borderLeft:'none'}}>
                            <tr>
                                {renderTableHeaders()}
                            </tr>
                        </thead>
                        <tbody>
                            {
                                studentsData !== null && studentsData.map(item => {
                                    return (
                                        <tr key={item.email}>
                                            {renderTablebody(item.email)}
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div> 
                <button className='btn btn-primary mt-3' onClick={attSave}>Save</button>
            </section>

            {/* Home Work */}
            <section className='text-center mt-5 py-3 class-hw'>
                <h2 className='mb-4 text-decoration-underline'>Daily Home Work</h2> 
                <div>
                    <p className='hw-date'>Today : {`${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`}</p> 
                    <textarea className='mt-3 p-3 rounded stu-hw-in-class' value={lasthwDate+'\n\n'+hw} onChange={(e)=>setHw((e.target.value).slice(11))}/>
                </div>
                <button className='btn btn-primary' onClick={saveHW}>Save</button>    
            </section>

            {/* result */}

            <section className='text-center mt-5 pb-5 pt-3 class-result'>
                <h2 className='mb-4 text-decoration-underline'>Lastest Exam Result</h2>
                <label className='me-2'>Exam Name : </label>
                <input className='mb-2 text-center' required placeholder='Enter Exam Name' value={exN} name="examName" onChange={(e)=>setExN(e.target.value)}/> <br/>
                <label>Select the number of subjects : </label>
                <select className='ms-2' onChange={(e) => {
                    setTotalSubjects(parseInt(e.target.value));
                    setSubjects([]);
                    setResultobj(prevState => ({
                        ...prevState,
                        result: {}
                    }));
                    setNewCreation(true);
                }}>
                    {Array.from({ length: 9 }).map((_, index) => (
                        <option key={index} value={index + 1}>{index + 1}</option>
                    ))}
                </select>

                <div className='w-50 d-flex m-auto mt-2'>
                    {Array.from({ length: totalSubjects }).map((_, index) => (
                        <input
                            key={index}
                            className='w-100 me-2 text-center'
                            type='text'
                            placeholder={'sub ' + (index + 1)}
                            value={subjects.length !== 0 ? subjects[index] : ''}
                            onChange={(e) => {
                                const updatedSubjects = [...subjects];
                                updatedSubjects[index] = e.target.value;
                                setSubjects(updatedSubjects);
                            }}
                        />
                    ))}
                </div>

                {
                subjects.length !== 0 &&
                
                <div className='p-2 mx-2 m-auto mt-4 bg-white' style={{ boxShadow: '0px 0px 20px -5px gray',overflowX:'auto' }}>
                    <table className='w-100'>
                        <thead className='' style={{ border: '2px solid gray' }}>
                            <tr>
                                <td className='border p-1'><strong>Name</strong></td>
                                <td className='border p-1'><strong>Rollno</strong></td>
                                {Array.from({ length: subjects.length }).map((_, index) => (
                                    <td key={index} className='border p-1'><strong>{subjects[index]}</strong></td>
                                ))}
                                <td className='border p-1'><strong>Total</strong></td>
                                <td className='border p-1'><strong>Percentage</strong></td>
                                <td className='border p-1'><strong>Grade</strong></td>
                            </tr>
                        </thead>
                        <tbody>
                            {studentsData !== null && studentsData.map((item, i) => (
                                <tr key={i}>
                                    <td className='border'>{item.name}</td>
                                    <td className='border'>{item.rollno}</td>
                                    {Array.from({ length: subjects?.length }).map((_, index) => (
                                        <td key={index} className='border p-1'>
                                            <input
                                                name={subjects.length !== 0 && subjects[index]}
                                                value={(resultobj?.result?.hasOwnProperty(item.email.slice(0, -4)) &&
                                                    resultobj?.result[item.email.slice(0, -4)].hasOwnProperty(subjects[index]))
                                                    ? resultobj.result[item.email.slice(0, -4)][subjects[index]]
                                                    : ''}
                                                className='w-100'
                                                placeholder='mark'
                                                type='number'
                                                onChange={(event) =>{ 
                                                    handleChange(event, item.email)
                                                }}
                                            />
                                        </td>
                                    ))}
                                    <td className='border p-1'>
                                        <input
                                            name="total"
                                            value={resultobj?.result?.[item.email.slice(0, -4)]?.total || ''}
                                            className='w-100'
                                            placeholder='Total'
                                            onChange={(event) => handleChange(event, item.email)}
                                        />
                                    </td>
                                    <td className='border p-1'>
                                        <input
                                            name="percentage"
                                            value={resultobj?.result?.[item.email.slice(0, -4)]?.percentage || ''}
                                            className='w-100'
                                            placeholder='%'
                                            onChange={(event) => handleChange(event, item.email)}
                                        />
                                    </td>
                                    <td className='border p-1'>
                                        <select
                                            name="grade"
                                            onChange={(event) => handleChange(event, item.email)}
                                            value={resultobj?.result?.[item.email.slice(0, -4)]?.grade}
                                        >
                                            <option value="">-</option>
                                            <option value="A+">A+</option>
                                            <option value="A">A</option>
                                            <option value="B+">B+</option>
                                            <option value="B">B</option>
                                            <option value="C+">C+</option>
                                            <option value="C">C</option>
                                            <option value="D">D</option>
                                            <option value="F">F</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        Object.keys(resultobj.result).length === 0 && 
                        <div className='mt-2'>
                            <p className='text-center w-100 m-auto'>No students in your class</p>
                        </div>
                    }
                    <button className='btn btn-primary mt-3' onClick={submit}>Submit</button>
                </div>
                }
            </section>
                
        </>
     );
}

export default Class;