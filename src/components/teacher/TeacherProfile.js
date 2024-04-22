import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

function TeacherProfile() {

    const useremail = useSelector((state) => state.user.email);

    const [teacherData, setTeacherData] = useState(null);
    const [img , setImg] = useState('')
    const [prevImg,setPrevImg] = useState('')

    useEffect(()=>{
        axios.get(`http://localhost:3001/getTeacherDetail/${useremail}`)
        .then(response => {
            setTeacherData(response.data.user[0])
            setPrevImg(response.data.user[0].image)
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[useremail])

    const [formData, setFormData] = useState({
        email: useremail,
        teacherDetails: {
            fullname: '',
            currentRole: '',
            previousRoles: '',
            age: '',
            gender: '',
            fatherName: '',
            motherName: '',
            currentAddress: '',
            permanentAddress: '',
            maritalStatus: '',
            husbandName: '',
            children: '',
            contact : '',
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
        if (teacherData !== null && teacherData.teacherProfile !== null) {
            setFormData(prevState => {
                const updatedTeacherDetails = { ...prevState.teacherDetails };
                for (const key in teacherData.teacherProfile) {
                    if (key in updatedTeacherDetails) {
                        if(key === 'emergencyContact1'){
                            for (const subKey  in teacherData.teacherProfile.emergencyContact1) {
                                console.log(teacherData.teacherProfile.emergencyContact1[subKey])
                                updatedTeacherDetails.emergencyContact1[subKey] = teacherData.teacherProfile.emergencyContact1[subKey];
                            }  
                        }
                        else if(key === 'emergencyContact2'){
                            for (const subKey  in teacherData.teacherProfile.emergencyContact2) {
                                updatedTeacherDetails.emergencyContact2[subKey] = teacherData.teacherProfile.emergencyContact2[subKey];
                            }  
                        }
                        else{
                            updatedTeacherDetails[key] = teacherData.teacherProfile[key];
                        }
                    }
                }
                return {
                    ...prevState,
                    teacherDetails: updatedTeacherDetails
                };
            });
        }
    },[teacherData])

    const handleChange = (e) => {
        const { name, value } = e.target;
        if(name === 'em_name1' || name === 'em_relationship1' || name === 'em_mobileNumber1'){
            console.log(name)
            setFormData(prevState => ({
                ...prevState,
                teacherDetails: {
                    ...prevState.teacherDetails,
                    emergencyContact1: {
                        ...prevState.teacherDetails.emergencyContact1,
                        [name]: value
                    }
                }
            }));
        }
        else if(name === 'em_name2' || name === 'em_relationship2' || name === 'em_mobileNumber2'){
            setFormData(prevState => ({
                ...prevState,
                teacherDetails: {
                    ...prevState.teacherDetails,
                    emergencyContact2: {
                        ...prevState.teacherDetails.emergencyContact2,
                        [name]: value
                    }
                }
            }));
        }
        else{
            setFormData(prevState => ({
                ...prevState,
                teacherDetails: {
                    ...prevState.teacherDetails, 
                    [name]: value 
                }
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/updateTeachersDetails', formData)
        .then(response => {
            if(response.data.message === 'Teacher details updated successfully'){
                alert('Profile Details Updated Successfully')
            }
            axios.get(`http://localhost:3001/getTeacherDetail/${useremail}`)
            .then(response => {
                setTeacherData(response.data.user[0])
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
        axios.post('http://localhost:3001/updateTeachersImage', {
                image : img,
                email : useremail
            } , {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            if(response.data.message === 'Teacher Image updated successfully'){
                alert('Photo Updated Successfully')
            }
            axios.get(`http://localhost:3001/getTeacherDetail/${useremail}`)
            .then(response => {
                setTeacherData(response.data.user[0])
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

    let aa = prevImg.split('\\');
    aa = aa?.slice(3); 
    aa = aa?.join('/');

    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <section className='w-50 m-auto overflow-hidden t-profile mb-5'>
                <h3>Profile</h3>
                <form className='ms-3 w-75' onSubmit={handleSubmit}>
                    <div className="profile-divs">
                        <p>Fullname : </p>
                        <input 
                            type="text"
                            name="fullname"
                            value={formData.teacherDetails.fullname}
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
                        <p>Current Role : </p>
                        <input 
                            type="text"
                            name="currentRole"
                            value={formData.teacherDetails.currentRole}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Previous Roles : </p>
                        <input 
                            type="text"
                            name="previousRoles"
                            value={formData.teacherDetails.previousRoles}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Age : </p>
                        <input 
                            type="number"
                            name="age"
                            value={formData.teacherDetails.age}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Gender : </p>
                        <select 
                            name="gender"
                            value={formData.teacherDetails.gender}
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
                            value={formData.teacherDetails.fatherName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Mother Name : </p>
                        <input 
                            type="text"
                            name="motherName"
                            value={formData.teacherDetails.motherName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Current Address : </p>
                        <textarea 
                            name="currentAddress"
                            value={formData.teacherDetails.currentAddress}
                            onChange={handleChange}
                            className='w-100'
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Permanent Address : </p>
                        <textarea 
                            name="permanentAddress"
                            value={formData.teacherDetails.permanentAddress}
                            onChange={handleChange}
                            className='w-100'
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Marital Status : </p>
                        <label className='me-1'>Single</label>
                        <input 
                            type="radio"
                            name="maritalStatus"
                            value="single"
                            checked={formData.teacherDetails.maritalStatus === "single"}
                            onChange={handleChange}
                        />
                        <label className='me-1 ms-3'>Married</label>
                        <input 
                            type="radio"
                            name="maritalStatus"
                            value="married"
                            checked={formData.teacherDetails.maritalStatus === "married"}
                            onChange={handleChange}
                        />
                    </div>
                    {formData.teacherDetails.maritalStatus === 'married' && (
                        <>
                            <div className="profile-divs">
                                <p>Husband Name : </p>
                                <input 
                                    type="text"
                                    name="husbandName"
                                    value={formData.teacherDetails.husbandName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="profile-divs">
                                <p>Children : </p>
                                <input 
                                    type="text"
                                    name="children"
                                    value={formData.teacherDetails.children}
                                    onChange={handleChange}
                                />
                            </div>
                        </>
                    )}
                    <div className="profile-divs">
                        <p>Mobile Number : </p>
                        <input 
                            type="text"
                            name="contact"
                            value={formData.teacherDetails.contact}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Emergency Contact 1 : </p>
                        <input 
                            type="text"
                            name="em_name1"
                            value={formData.teacherDetails.emergencyContact1.em_name1}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        <input 
                            type="text"
                            name="em_relationship1"
                            value={formData.teacherDetails.emergencyContact1.em_relationship1}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        <input 
                            type="text"
                            name="em_mobileNumber1"
                            value={formData.teacherDetails.emergencyContact1.em_mobileNumber1}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="profile-divs">
                        <p>Emergency Contact 2 : </p>
                        <input 
                            type="text"
                            name="em_name2"
                            value={formData.teacherDetails.emergencyContact2.em_name2}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        <input 
                            type="text"
                            name="em_relationship2"
                            value={formData.teacherDetails.emergencyContact2.em_relationship2}
                            onChange={handleChange}
                            className='mb-2'
                        />
                        <input 
                            type="text"
                            name="em_mobileNumber2"
                            value={formData.teacherDetails.emergencyContact2.em_mobileNumber2}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" className='btn btn-primary'>Submit</button>
                </form>
                <div className='mt-2 ms-3' style={{position:'relative'}}>
                    <p className='m-0 fw-bold'>Your Picture :</p>
                    <input type="file" accept="image/*" name="image" onChange={(e)=>setImg(e.target.files[0])}/> <br/>
                    <button className='btn btn-primary mt-2 mb-3' onClick={uploadImg}>Upload Image</button>

                    <div className='d-flex align-items-center'>
                        <span>Current Photo :</span>
                        <div className='ms-2 mb-3' style={{width:'150px',height:'200px',border:'2px solid black'}}>
                            <img className='w-100 h-100' src={"../"+aa} alt="TeacherImage" />
                        </div>
                    </div>
                </div>
            </section>
        </>
     );
}

export default TeacherProfile;