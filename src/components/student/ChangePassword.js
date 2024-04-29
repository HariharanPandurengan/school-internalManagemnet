import React, { useEffect, useState } from 'react';
import StudentNavbar from './StudentNavbar';
import '../custom.css';
import { useSelector } from "react-redux";
import axios from 'axios'

function ChangePassword() {
    const [prePassSucc , setPrePassSucc] = useState(false)
    const [prePass , setPrePass] = useState('')
    const [newPass , setNewPass] = useState('')
    const [newPassCon , setNewPassCon] = useState('')
    const useremail = useSelector((state) => state.user.email);

    function passCheck(){
        axios.post('http://localhost:3001/studentPasswordCheck', {
            email : useremail,
            password : prePass
        })
        .then(response => {
            if(response.data.message === 'Password matched'){
                setPrePassSucc(true)
            }
            else{
                alert('Wrong Password')
            }
           
        })
        .catch(error => {
            console.error('Error fetching attendance:', error);
        });
    }

    function ChangePass(){
        if(newPass === newPassCon && newPass !== ''){
            axios.post('http://localhost:3001/studentChangePassword', {
                email : useremail,
                password : newPass
            })
            .then(response => {
                if(response.data.message === 'Password Changed successfully'){
                    alert('Password Changed Successfully')
                }
                else{
                    alert('Password Failed To Change')
                }
               
            })
            .catch(error => {
                console.error('Error fetching attendance:', error);
            });
        }
        else if(newPass === ''){
            alert('Enter Password')
        }
        else if(newPass !== newPassCon){
            alert('Enter same password in confirm password')
        }
    }
    return ( 
        <>
            <StudentNavbar></StudentNavbar>
            <section>
                <h2>Change Password</h2>
                <div className='stu-techer-passChange-div m-auto mt-3 d-flex flex-column'>
                    <input type='password' onChange={(e)=>setPrePass(e.target.value)} value={prePass} className={prePassSucc ? 'd-none' :'text-center rounded mb-2'} placeholder='Enter Previous Password'/>
                    <button onClick={passCheck} className={prePassSucc ? 'd-none' : 'btn btn-primary mb-4 w-25 m-auto'}>Ok</button>
                    <input type='password' onChange={(e)=>setNewPass(e.target.value)} value={newPass} className={prePassSucc ?'text-center rounded mb-2' : 'd-none'} placeholder='Enter New Password'/>
                    <input type='password' onChange={(e)=>setNewPassCon(e.target.value)} value={newPassCon} className={prePassSucc ?'text-center rounded mb-2' : 'd-none'} placeholder='Confirm Passowrd'/>
                    <button onClick={ChangePass} className={prePassSucc ? 'btn btn-primary mb-4 w-25 m-auto' : 'd-none'}>Ok</button>
                </div>
            </section>
        </>
     );
}

export default ChangePassword;