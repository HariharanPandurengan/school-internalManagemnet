import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import { useSelector } from 'react-redux';
import axios from 'axios';

function Result() {
    const useremail = useSelector((state) => state.user.email);

    const [studentDet, setStudentDet] = useState(null);
    const [preResult, setPreResult] = useState(null);
    const [totalSubjects, setTotalSubjects] = useState(0);
    const [subjects, setSubjects] = useState([]);
    const [newCreation, setNewCreation] = useState(false);
    const [obj, setObj] = useState({
        ctEmail: useremail,
        examName : '',
        result: {}
    });

    useEffect(() => {
        axios.get(`http://localhost:3001/getresultforTeacher/${useremail}`)
            .then(response => {
                if(response.data.message !== 'Student not found'){
                    console.log(response.data.user)
                    setPreResult(response.data.user);
                }
            })
            .catch(error => {
                console.error('Error fetching admins:', error);
            });

        axios.get(`http://localhost:3001/getStudentsForClassTeachers/${useremail}`)
            .then(response => {
                setStudentDet(response.data.user);
            })
            .catch(error => {
                console.error('Error fetching admins:', error);
            });
    }, [useremail]);

    useEffect(() => { 
        
        studentDet?.map(item => {
            obj.result[item.email.slice(0, -4)] = {}
        })

        if (newCreation === false) {
            if(preResult !== null){
                const updatedObj = { ...obj };

                for (let key in preResult.result) {
                    if (updatedObj.result.hasOwnProperty(key)) {
                        updatedObj.result[key] = preResult.result[key];
    
                        if (subjects.length === 0) {
                            const arr = [];
                            for (let skey in preResult.result[key]) {
                                if (!(skey === 'total') && !(skey === 'percentage') && !(skey === 'grade')) {
                                    arr.push(skey);
                                }
                            }
                            setSubjects(arr);
                        }
                    }
                }
                setObj(updatedObj);
            }
        }
    }, [newCreation, preResult, subjects]);

    function handleChange(event, email) {
        if(event.target.name === 'examName'){
            const value = event.target.value;
            const updatedObj = { ...obj };
            updatedObj.examName = value;
            setObj(updatedObj);
        }
        else{
            const name = event.target.name;
            const value = event.target.value;
            const em = email.slice(0, -4);
    
            const updatedObj = { ...obj };
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
            setObj(updatedObj);
        }
    }

    const submit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/insertUpdateResult', obj);
            if (response.data.message === 'Result Saved Successfully') {
                alert('Result Saved Successfully');
            }
        } catch (error) {
            console.error('Error getting Teacher Logdata:', error);
        }
    };

    return (
        <>
            <TeacherNavbar></TeacherNavbar>
            <section className='text-center'>
                <h2 className='mb-4 text-decoration-underline'>Lastest Exam Result</h2>
                <label className='me-2'>Exam Name : </label>
                <input className='mb-2 text-center' placeholder='Enter Exam Name' value={obj.examName} name="examName" onChange={handleChange}/> <br/>
                <label>Select the number of subjects: </label>
                <select onChange={(e) => {
                    setTotalSubjects(parseInt(e.target.value));
                    setSubjects([]);
                    setObj(prevState => ({
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
                
                <div className='p-2 w-75 m-auto mt-4' style={{ boxShadow: '0px 0px 20px -5px gray' }}>
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
                            {studentDet !== null && studentDet.map((item, i) => (
                                <tr key={i}>
                                    <td className='border'>{item.name}</td>
                                    <td className='border'>{item.rollno}</td>
                                    {Array.from({ length: subjects.length }).map((_, index) => (
                                        <td key={index} className='border p-1'>
                                            <input
                                                name={subjects[index]}
                                                value={obj?.result[item.email.slice(0, -4)][subjects[index]] || ''}
                                                className='w-100'
                                                placeholder='mark'
                                                type='number'
                                                onChange={(event) => handleChange(event, item.email)}
                                            />
                                        </td>
                                    ))}
                                    <td className='border p-1'>
                                        <input
                                            name="total"
                                            value={obj?.result?.[item.email.slice(0, -4)]?.total || ''}
                                            className='w-100'
                                            placeholder='Total'
                                            onChange={(event) => handleChange(event, item.email)}
                                        />
                                    </td>
                                    <td className='border p-1'>
                                        <input
                                            name="percentage"
                                            value={obj?.result?.[item.email.slice(0, -4)]?.percentage || ''}
                                            className='w-100'
                                            placeholder='%'
                                            onChange={(event) => handleChange(event, item.email)}
                                        />
                                    </td>
                                    <td className='border p-1'>
                                        <select
                                            name="grade"
                                            onChange={(event) => handleChange(event, item.email)}
                                        >
                                            <option value="">-</option>
                                            <option value="A+" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'A+'}>A+</option>
                                            <option value="A" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'A'}>A</option>
                                            <option value="B+" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'B+'}>B+</option>
                                            <option value="B" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'B'}>B</option>
                                            <option value="C+" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'C+'}>C+</option>
                                            <option value="C" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'C'}>C</option>
                                            <option value="D" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'D'}>D</option>
                                            <option value="F" selected={obj?.result?.[item.email.slice(0, -4)]?.grade === 'F'}>F</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {
                        Object.keys(obj.result).length === 0 && 
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

export default Result;
