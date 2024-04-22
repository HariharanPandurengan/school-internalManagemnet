import React, { useEffect, useState } from 'react';
import '../custom.css';
import StudentNavbar from './StudentNavbar';
import { useSelector } from 'react-redux';
import axios from 'axios'

function Homework() {
    const useremail = useSelector((state) => state.user.email);

    const [hw , setHw ] = useState('')
    const [lasthwDate , setLasthwDate] = useState('')

    useEffect(()=>{
        axios.get(`http://localhost:3001/getStud/${useremail}`)
        .then(response => {  

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

        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });

      
    },[useremail])
    return ( 
        <>
            <StudentNavbar></StudentNavbar>
            <div className='text-center'>
                <textarea disabled className='p-3 rounded' value={lasthwDate+'\n\n'+hw} style={{minWidth:'700px',minHeight:'400px',boxShadow:'0px 0px 5px 0px gray',border:'none'}}/>
            </div>
        </>
     );
}

export default Homework;