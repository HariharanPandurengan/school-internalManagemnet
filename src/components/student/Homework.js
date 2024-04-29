import React, { useEffect, useState } from 'react';
import '../custom.css';
import StudentNavbar from './StudentNavbar';
import { useSelector } from 'react-redux';
import axios from 'axios'

function Homework() {
    const useremail = useSelector((state) => state.user.email);

    const [hw , setHw ] = useState('')
    const [lasthwDate , setLasthwDate] = useState('')
    const [noClass,setNoClass] = useState(false)

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStud/${useremail}`)
        .then(response => {  
            if(response.data.user.className !== '' && response.data.user.className !== null){
                axios.get(`http://localhost:3001/getHomework/${response.data.user.className}`)
                .then(response => {  
                    if (response.data.message !== 'No hw found') {
                        setHw(response.data.hw[0].homework)
                        setLasthwDate(response.data.hw[0].date)
                    }
                    else{
                        setHw('No Home Work Updated')
                    }
                })
                .catch(error => {
                  console.error('Error fetching admins:', error);
                });
            }
            else{
                setNoClass(true)
            }

        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });

      
    },[useremail])
    return ( 
        <>
            <StudentNavbar></StudentNavbar>
            <div className='text-center'>
                <textarea disabled className='p-3 rounded stu-hw' value={noClass ? 'You are not added in your classroom' : lasthwDate+'\n\n'+hw}/>
            </div>
        </>
     );
}

export default Homework;