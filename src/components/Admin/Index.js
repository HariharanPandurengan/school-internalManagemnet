import React, { useEffect } from 'react';
import '../custom.css';
import axios from 'axios'
import { useState } from 'react';
import { useNavigate ,useLocation} from 'react-router-dom';
import { useDispatch } from "react-redux";
import { adminLogin } from '../store';
import { userDetails } from '../store';


function Index() {

   const dispatch = useDispatch();
   const navigate = useNavigate();
   const location = useLocation(); 

   if(location.pathname === '/'){
      dispatch(adminLogin(false))
   }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await axios.post('http://localhost:3001/adminLogin ', {
                email: email,
                password: password
            });
            if(response.data === false){
               alert('Worng Email or Password')
            }
            else{
               const { userFound , name , email } = response.data;
               const details = {
                  username : name,
                  email : email,
               }
               dispatch(userDetails(details))
               dispatch(adminLogin(true))
               navigate('/adminHome')
            }
            
        } catch (error) {
            console.error('Error creating teacher:', error);
        }
    };

    return ( 
        <section className='WholeContainer'>
            <div className="login-container">
                  <form className="login-form" onSubmit={handleSubmit}>
                     <h2>Admin Login</h2>
                     <div className="input-group">
                        <label htmlFor="username">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                     </div>
                     <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                     </div>
                     <button type="submit">Login</button>
                  </form>
            </div>
        </section>
     );
}

export default Index;