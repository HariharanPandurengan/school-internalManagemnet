import React, { useEffect, useState } from 'react';
import '../custom.css';
import TeacherNavbar from './TeacherNavbar';
import axios from 'axios'
import { useSelector } from 'react-redux';

function Home() {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [logData, setLogData] = useState(null);
    const useremail = useSelector((state) => state.user.email);

    useEffect(()=>{
        const interval = setInterval(() => {
            setCurrentDateTime(getCurrentTime());
          }, 1000);
      
        return () => clearInterval(interval);
    },[])

    useEffect(() => {
        axios.get(`http://localhost:3001/getTeacherLogData/${useremail}`)
        .then(response => {
            response.data.user.length >= 1 && setLogData(response.data.user)
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
      }, [useremail]);

      function getCurrentTime() {
        const date = new Date();
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // 12-hour format
        const strTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
        return strTime;
      }

    const handleOptionChange = async (e) => {

        e.preventDefault();

        const selectedOption = e.target.value;

        const currentDate = new Date();
        let day = currentDate.getDate(); 
        if (day < 10) {
            day = '0' + day;
        }
        let month = currentDate.getMonth() + 1; // Get the month (0-11), add 1 to get the correct month number
        if (month < 10) {
            month = '0' + month;
        }
        const year = currentDate.getFullYear();
    
        const formattedDate = `${day}/${month}/${year}`;

        try {
            const response = await axios.post('http://localhost:3001/insertTeacherLogData', {
                email : useremail,
                currentpurpose: selectedOption,
                currentDate : formattedDate,
                Currenttime: getCurrentTime()
            });
            if(response.data === false){
               alert('Trouble in getting logdata')
            }
            else{
               axios.get(`http://localhost:3001/getTeacherLogData/${useremail}`)
               .then(res => {
                    res.data.user.length >= 1 && setLogData(res.data.user)
            })
               .catch(error => {
                 console.error('Error fetching admins:', error);
               });
              
            }
        } catch (error) {
            console.error('Error getting Teacher Logdata:', error);
        }
    };
    return ( 
        <>
            <TeacherNavbar></TeacherNavbar>
            <section id="teacher-login">
                <h4>Login</h4>
                <p>{currentDateTime.toLocaleString()}</p>
                <table className='table'>
                    <thead>
                        <tr>
                            <td>Time</td>
                            <td>Purpose</td>
                        </tr>
                    </thead>
                    <tbody>
                        {logData !== null && logData.map((log, index) => (
                            <tr key={index}>
                                <td>{log.time}</td>
                                <td>{log.purpose}</td>
                            </tr>
                        ))}
                        {
                            logData === null && <tr>
                                <td colSpan={2}>Your are not login today</td>
                            </tr>
                        }
                    </tbody>
                </table>
                <select onChange={handleOptionChange}>
                    {
                        logData === null && (
                        <>
                            <option selected disabled>Select</option>
                            <option value='Login'>Login</option>
                        </>
                        )
                    }
                    {
                        logData !== null && logData.length === 1 && logData[0].purpose === 'Login' && (
                        <>
                            <option selected disabled>Select</option>
                            <option value='Logout'>Logout</option>
                        </>
                        )
                    }
                    {
                        logData !== null && logData.length >= 2 && (
                        <>
                            <option selected>You Completed Todays Log</option>
                        </>
                        )
                    }
                </select>
            </section>
        </>
     );
}

export default Home;