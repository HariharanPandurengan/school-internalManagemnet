import React, { useEffect, useState } from 'react';
import '../custom.css';
import StudentNavbar from './StudentNavbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

function Home() {
    const useremail = useSelector((state) => state.user.email);

    const [studentData, setStudentData] = useState(null);
    const [img , setImg] = useState('')
    const [prevImg,setPrevImg] = useState('')
    const [notifiContent,setNotifiContent] = useState(null)

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStudentDetail/${useremail}`)
        .then(response => {
            setStudentData(response.data.user[0])
            setPrevImg(response.data.user[0].image)
        })
        .catch(error => {
          console.error('Error fetching student details:', error);
        });

        axios.get(`http://localhost:3001/getStudentNotifications/${useremail}`)
        .then(response => {
            if(response.data.message === 'Result,Exam Time Table and Class Time Table updated'){
                
                setNotifiContent('"Result","Exam TimeTable" and "Class TimeTable" updated')
            }
            if(response.data.message === 'Result and Exam Time Table updated'){
                
                setNotifiContent('"Result" and "Exam TimeTable" updated')
            }
            if(response.data.message === 'Result and Class Time Table updated'){
                
                setNotifiContent('"Result" and "Class TimeTable" updated')
            }
            if(response.data.message === 'Exam Time Table and Class Time Table updated'){
                
                setNotifiContent('"Exam TimeTable" and "Class TimeTable" updated')
            }
            if(response.data.message === 'Result updated'){
                
                setNotifiContent('"Result" updated')
            }
            if(response.data.message === 'Exam Time Table updated'){
               
                setNotifiContent('"Exam TimeTable" updated')
            }
            if(response.data.message === 'Class Time Table updated'){
        
                setNotifiContent('"Class TimeTable" updated')
            }
        })
        .catch(error => {
          console.error('Error fetching notification:', error);
        });
    },[useremail])

    console.log(notifiContent)

    const [formData, setFormData] = useState({
        email: useremail,
        studentDetails: {
            fullname: '',
            age: '',
            std:'',
            section:'',
            gender: '',
            fatherName: '',
            motherName: '',
            currentAddress: '',
            permanentAddress: '',
            fatherNumber : '',
            motherNumber: '',
            emergencyContact1: {
                em_name1: '',
                em_relationship1: '',
                em_mobileNumber1: ''
            },
            emergencyContact2: {
                em_name2: '',
                em_relationship2: '',
                em_mobileNumber2: ''
            },
        }
    });

    useEffect(()=>{
        if (studentData !== null && studentData.studentProfile !== null) {
            setFormData(prevState => {
                const updatedstudentDetails = { ...prevState.studentDetails };
                for (const key in studentData.studentProfile) {
                    if (key in updatedstudentDetails) {
                        if(key === 'emergencyContact1'){
                            for (const subKey  in studentData.studentProfile.emergencyContact1) {
                                console.log(studentData.studentProfile.emergencyContact1[subKey])
                                updatedstudentDetails.emergencyContact1[subKey] = studentData.studentProfile.emergencyContact1[subKey];
                            }  
                        }
                        else if(key === 'emergencyContact2'){
                            for (const subKey  in studentData.studentProfile.emergencyContact2) {
                                updatedstudentDetails.emergencyContact2[subKey] = studentData.studentProfile.emergencyContact2[subKey];
                            }  
                        }
                        else{
                            updatedstudentDetails[key] = studentData.studentProfile[key];
                        }
                    }
                }
                return {
                    ...prevState,
                    studentDetails: updatedstudentDetails
                };
            });
        }
    },[studentData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'em_name1' || name === 'em_relationship1' || name === 'em_mobileNumber1'){
            console.log(name)
            setFormData(prevState => ({
                ...prevState,
                studentDetails: {
                    ...prevState.studentDetails,
                    emergencyContact1: {
                        ...prevState.studentDetails.emergencyContact1,
                        [name]: value
                    }
                }
            }));
        }
        else if(name === 'em_name2' || name === 'em_relationship2' || name === 'em_mobileNumber2'){
            setFormData(prevState => ({
                ...prevState,
                studentDetails: {
                    ...prevState.studentDetails,
                    emergencyContact2: {
                        ...prevState.studentDetails.emergencyContact2,
                        [name]: value
                    }
                }
            }));
        }
        else{
            setFormData(prevState => ({
                ...prevState,
                studentDetails: {
                    ...prevState.studentDetails, 
                    [name]: value 
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/updateStudentDetails', formData)
        .then(response => {
            if(response.data.message === 'Student details updated successfully'){
                alert('Profile details updated successfully')
            }
            axios.get(`http://localhost:3001/getStudentDetail/${useremail}`)
            .then(response => {
                setStudentData(response.data.user[0])
                setPrevImg(response.data.user[0].image)
            })
            .catch(error => {
              console.error('Error fetching admins:', error);
            });
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    };

    const uploadImg = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/updateStudentsImage', {
                image : img,
                email : useremail
            } , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if(response.data.message === 'Student Image updated successfully'){
                alert('Photo Updated Successfully')
            }
            axios.get(`http://localhost:3001/getStudentDetail/${useremail}`)
            .then(response => {
                setStudentData(response.data.user[0])
                setPrevImg(response.data.user[0].image)
            })
            .catch(error => {
              console.error('Error fetching admins:', error);
            });
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    };

    let aa = prevImg?.split('\\');
    aa = aa?.slice(3); 
    aa = aa?.join('/');

    function notfiOK(){
        axios.get(`http://localhost:3001/StudentNotificationsOK/${useremail}`)
        .then(response => {
            if(response.data.message === 'ok'){
                setNotifiContent(null)
            }
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    }
    return ( 
        <section style={{position:'relative'}}>
            {
                notifiContent && 
                <div className='stuNotPopup'>
                    <div className='bg-white w-50 m-auto text-center p-4' style={{boxShadow:'0px 0px 10px 0px black'}}>
                        <h3 className='mb-4'>{notifiContent}</h3>
                        <button className='btn btn-primary w-25' onClick={notfiOK}>OK</button>
                    </div>
                </div>
            }
            <StudentNavbar></StudentNavbar>
            <section className='w-50 m-auto overflow-hidden t-profile'>
                <h3>Profile</h3>
                <form className='ms-3 w-75' onSubmit={handleSubmit}>
                    <div className="profile-divs">
                        <p>Fullname : </p>
                        <input 
                            type="text"
                            name="fullname"
                            value={formData.studentDetails.fullname}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Email : </p>
                        <input 
                            type="email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Standard : </p>
                        <select name="std" onChange={handleChange}>
                            <option value='lkg' selected={formData.studentDetails.std === 'lkg' ? true : false}>LKG</option>
                            <option value='ukg' selected={formData.studentDetails.std === 'ukg' ? true : false}>UKG</option>
                            <option value='1' selected={formData.studentDetails.std === '1' ? true : false}>1</option>
                            <option value='2' selected={formData.studentDetails.std === '2' ? true : false}>2</option>
                            <option value='3' selected={formData.studentDetails.std === '3' ? true : false}>3</option>
                            <option value='4' selected={formData.studentDetails.std === '4' ? true : false}>4</option>
                            <option value='5' selected={formData.studentDetails.std === '5' ? true : false}>5</option>
                            <option value='6' selected={formData.studentDetails.std === '6' ? true : false}>6</option>
                            <option value='7' selected={formData.studentDetails.std === '7' ? true : false}>7</option>
                            <option value='8' selected={formData.studentDetails.std === '8' ? true : false}>8</option>
                            <option value='9' selected={formData.studentDetails.std === '9' ? true : false}>9</option>
                            <option value='10' selected={formData.studentDetails.std === '10' ? true : false}>10</option>
                            <option value='11' selected={formData.studentDetails.std === '11' ? true : false}>11</option>
                            <option value='12' selected={formData.studentDetails.std === '12' ? true : false}>12</option>
                        </select>
                    </div>
                    <div className="profile-divs">
                        <p>Section : </p>
                        <select name="section" onChange={handleChange}>
                            <option value='a' selected={formData.studentDetails.section === 'a' ? true : false}>A</option>
                            <option value='b' selected={formData.studentDetails.section === 'b' ? true : false}>B</option>
                            <option value='c' selected={formData.studentDetails.section === 'c' ? true : false}>C</option>
                            <option value='d' selected={formData.studentDetails.section === 'd' ? true : false}>D</option>
                            <option value='e' selected={formData.studentDetails.section === 'e' ? true : false}>E</option>
                        </select>
                    </div>
                    <div className="profile-divs">
                        <p>Age : </p>
                        <input 
                            type="number"
                            name="age"
                            value={formData.studentDetails.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Gender : </p>
                        <select 
                            name="gender"
                            value={formData.studentDetails.gender}
                            onChange={handleChange}
                        >
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </div>
                    <div className="profile-divs">
                        <p>Father Name : </p>
                        <input 
                            type="text"
                            name="fatherName"
                            value={formData.studentDetails.fatherName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Mother Name : </p>
                        <input 
                            type="text"
                            name="motherName"
                            value={formData.studentDetails.motherName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Current Address : </p>
                        <textarea 
                            name="currentAddress"
                            value={formData.studentDetails.currentAddress}
                            onChange={handleChange}
                            className='w-100'
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Permanent Address : </p>
                        <textarea 
                            name="permanentAddress"
                            value={formData.studentDetails.permanentAddress}
                            onChange={handleChange}
                            className='w-100'
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Father Mobile Number : </p>
                        <input 
                            type="number"
                            name="fatherNumber"
                            value={formData.studentDetails.fatherNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Mother Mobile Number : </p>
                        <input 
                            type="number"
                            name="motherNumber"
                            value={formData.studentDetails.motherNumber}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Emergency Contact 1 : </p>
                        <input 
                            type="text"
                            name="em_name1"
                            value={formData.studentDetails.emergencyContact1.em_name1}
                            onChange={handleChange}
                            className='mb-2'
                            placeholder='Name'
                        />
                        <input 
                            type="text"
                            name="em_relationship1"
                            value={formData.studentDetails.emergencyContact1.em_relationship1}
                            onChange={handleChange}
                            className='mb-2'
                            placeholder='Relationship'
                        />
                        <input 
                            type="number"
                            name="em_mobileNumber1"
                            value={formData.studentDetails.emergencyContact1.em_mobileNumber1}
                            onChange={handleChange}
                            placeholder='Mobile Number'
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Emergency Contact 2 : </p>
                        <input 
                            type="text"
                            name="em_name2"
                            value={formData.studentDetails.emergencyContact2.em_name2}
                            onChange={handleChange}
                            className='mb-2'
                            placeholder='Name'
                        />
                        <input 
                            type="text"
                            name="em_relationship2"
                            value={formData.studentDetails.emergencyContact2.em_relationship2}
                            onChange={handleChange}
                            className='mb-2'
                            placeholder='Relationship'
                        />
                        <input 
                            type="number"
                            name="em_mobileNumber2"
                            value={formData.studentDetails.emergencyContact2.em_mobileNumber2}
                            onChange={handleChange}
                            placeholder='Mobile Number'
                        />
                    </div>
                    <button type="submit" className='btn btn-primary'>Submit</button>
                </form>
                <div className='mt-2 ms-3'>
                    <p className='m-0 fw-bold'>Your Picture :</p>
                    <input type="file" accept="image/*" name="image" onChange={(e)=>setImg(e.target.files[0])}/> <br/>
                    <button className='btn btn-primary mt-2 mb-3' onClick={uploadImg}>Upload Image</button>
                    <div className='d-flex align-items-center'>
                        <span>Current Photo :</span>
                        <div className='ms-2 mb-3' style={{width:'150px',height:'200px',border:'2px solid black'}}>
                            <img className='w-100 h-100' src={"../"+aa} alt="StudentImage" />
                        </div>
                    </div>
                </div>
            </section>
        </section>
     );
}

export default Home;