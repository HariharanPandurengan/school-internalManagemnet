import React, { useEffect, useState } from 'react';
import '../custom.css';
import StudentNavbar from './StudentNavbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

function Result() {

    const useremail = useSelector((state) => state.user.email);
    const [result , setResult] = useState(null)

    useEffect(()=>{
        axios.get(`http://localhost:3001/getresultforStudents/${useremail}`)
        .then(response => {
            if(response.data.message !== 'result not found'){
                setResult(response.data.StudentResult)
            }
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[useremail])

    const sub = {};

    if(result){
        for (let key in result.result) {
            if(key !== 'total' && key !== 'percentage' && key !== 'grade'){
                sub[key] = result.result[key]
            }
            
        }
    }

    return ( 
        <>
            <StudentNavbar></StudentNavbar>
            {
                (result !== null && Object.keys(result.result).length !== 0) &&
                    <section className='w-100 text-center'>
                        <h3 className='mb-4'>Result of "{result?.examName}"</h3>
                        <table className='w-75 m-auto text-center'>
                            <thead>
                                <tr>
                                    {
                                        Array.from({ length: Object.keys(sub).length }).map((_, index) => (
                                            <td key={index} className='border p-1'><strong>{Object.keys(sub)[index]}</strong></td>
                                        ))
                                    }
                                    <td key={'total'} className='border p-1'><strong>Total</strong></td>
                                    <td key={'percentage'} className='border p-1'><strong>Percentage</strong></td>
                                    <td key={'grade'} className='border p-1'><strong>Grade</strong></td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {
                                        Array.from({ length: Object.values(sub).length }).map((_, index) => (
                                            <td key={index} className='border p-1'><strong>{Object.values(sub)[index]}</strong></td>
                                        ))
                                    }
                                    <td key={'total'} className='border p-1'><strong>{result?.result.total}</strong></td>
                                    <td key={'percentage'} className='border p-1'><strong>{result?.result.percentage}</strong></td>
                                    <td key={'grade'} className='border p-1'><strong>{result?.result.grade}</strong></td>

                                </tr>
                            </tbody>
                        </table>
                    </section>
            }
            {
                (result === null || Object.keys(result.result).length === 0) &&
                <p className='text-center'>No result scheduled</p>
            }
        </>
     );
 }

export default Result;