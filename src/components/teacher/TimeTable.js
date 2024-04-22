import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import { useSelector } from 'react-redux';
import axios from 'axios'

function TimeTable() {
    const useremail = useSelector((state) => state.user.email);

    const[tt,setTt] = useState(null);
    const[ett,setETt] = useState(null);
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
    const[obj,setObj] = useState({
        ctEmail : useremail,
        examName : '',
        subName : {
            sub1 : '' , sub2 : '' , sub3 : '', sub4 : '', sub5 : '', sub6 : '', sub7 : '', sub8 : '', sub9 : ''
        },
        subDate : {
            sub1 : '' , sub2 : '' , sub3 : '', sub4 : '', sub5 : '', sub6 : '', sub7 : '', sub8 : '', sub9 : ''
        }
    });


    useEffect(()=>{
        axios.get(`http://localhost:3001/getTimetable/${useremail}`)
        .then(response => {  
            response.data.tt.length !== 0 && setTt(response.data.tt[0])
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });

        axios.get(`http://localhost:3001/getEttforTeacher/${useremail}`)
        .then(response => {  
            response.data.user.length !== 0 && setETt(response.data.user)
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

    useEffect(()=>{
        if (ett !== null) {
            setObj(prevState => {
                const updatedsubName = { ...prevState.subName };
                    for(const key in ett.subName){
                        if(updatedsubName.hasOwnProperty(key)){
                            updatedsubName[key] = ett.subName[key];
                        }
                    }
                return {
                    ...prevState,
                    subName: updatedsubName
                };
            });

            setObj(prevState => {
                const updatedsubDate = { ...prevState.subDate };
                    for(const key in ett.subDate){
                        if(updatedsubDate.hasOwnProperty(key)){
                            updatedsubDate[key] = ett.subDate[key];
                        }
                    }
                return {
                    ...prevState,
                    subDate: updatedsubDate
                };
            });

            setObj(prevState => ({
                ...prevState,
                examName : ett.examName
            }));

        }
    },[ett])



    const handleChange = (day, period, value) => {
        setTimetable(prevState => ({
            ...prevState,
            timetable: {
                ...prevState.timetable,
                [day]: {
                    ...prevState.timetable[day],
                    [period]: value
                }
            }
        }));
    };

    const updateTimetable = (e) => {
        e.preventDefault();
        axios.post('http://localhost:3001/teacherTimetable', timetable)
        .then(response => {
            if(response.data.message === 'Timetable Updated Successfully'){
                alert('Timetable Updated Successfully')
            }
        })
        .catch(error => {
            console.error('Error sending data:', error);
        });
    }

    
    function handleExamTimetable(e){
        const name = e.target.name;
        const value = e.target.value;
        if(name === "examName"){
            setObj(prevState => ({
                ...prevState,
                examName : value
            }));
        }
        for(let i=1;i<=9;i++){
            if(name === "sub"+i+"name"){
                setObj(prevState => ({
                    ...prevState,
                    subName: {
                        ...prevState.subName,
                        ["sub"+i] : value
                    }
                }));
            }
            if(name === "sub"+i+"value"){
                setObj(prevState => ({
                    ...prevState,
                    subDate: {
                        ...prevState.subDate,
                        ["sub"+i] : value
                    }
                }));
            }
        }
    }

    function etsubmit(){
        if(obj.examName === '' || obj.examName === null){
            alert('Enter Exam Name')
        }
        else{
            axios.post('http://localhost:3001/insertUpdateExamTimetable', obj)
            .then(response => {
                if(response.data.message === 'Saved Successfully'){
                    alert('Saved Successfully')
                }
            })
            .catch(error => {
                console.error('Error occurred:', error);
            });
        }
       
    }

    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <div className='w-100 text-center'>
                <h3 className='text-decoration-underline mb-3'>Class TimeTable</h3>
                <table className='table w-75 m-auto' style={{boxShadow:'0px 0px 20px -7px gray'}}>
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
                                        <input
                                            className='w-100'
                                            value={timetable.timetable[day][period]}
                                            onChange={(e) => handleChange(day, period, e.target.value)}
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className='btn btn-primary mt-3' onClick={updateTimetable}>Update</button>
            </div>
            <div className='mt-5 pb-5 text-center'>
                <h3 className='text-decoration-underline mb-3 text-center'>Latest Exam TimeTable</h3>  
                <span>Exam Name : </span><input onChange={(e)=>handleExamTimetable(e)} name="examName" placeholder='Enter Exam Name'/> 
                <table className='text-center border w-25 m-auto mt-3'>
                    <thead>
                        <tr className='border'>
                            <td className='border'><strong>Subject</strong></td>
                            <td><strong>Date</strong></td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub1name" value={obj.subName?.sub1} placeholder='Sub 1' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub1value" value={obj.subDate?.sub1} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub2name" value={obj.subName?.sub2} placeholder='Sub 2' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub2value" value={obj.subDate?.sub2} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub3name" value={obj.subName?.sub3} placeholder='Sub 3' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub3value" value={obj.subDate?.sub3} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub4name" value={obj.subName?.sub4} placeholder='Sub 4' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub4value" value={obj.subDate?.sub4} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub5name" value={obj.subName?.sub5} placeholder='Sub 5' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub5value" value={obj.subDate?.sub5} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub6name" value={obj.subName?.sub6} placeholder='Sub 6' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub6value" value={obj.subDate?.sub6} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub7name" value={obj.subName?.sub7} placeholder='Sub 7' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub7value" value={obj.subDate?.sub7} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub8name" value={obj.subName?.sub8} placeholder='Sub 8' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub8value" value={obj.subDate?.sub8} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                        <tr className='border'>
                            <td className='p-1 border'><input name="sub9name" value={obj.subName?.sub9} placeholder='Sub 9' onChange={(e)=>handleExamTimetable(e)}/></td>
                            <td className='p-1'><input type='date' name="sub9value" value={obj.subDate?.sub9} placeholder='Date' onChange={(e)=>handleExamTimetable(e)}/></td>
                        </tr>
                    </tbody>
                </table>  
                <button onClick={etsubmit} className='btn btn-primary mt-3'>Submit</button> 
            </div>
        </>
     );
}

export default TimeTable;