import React, { useEffect } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { adminLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

function Navbar() {

    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);

    const location = useLocation(); 
    const dispatch = useDispatch();

    return ( 
        <>
            <div className='mb-5 bg-primary text-white ps-3 py-1 d-flex justify-content-between'>
                <div>
                    <h2 className='text-start mb-0'>Welcome {username}</h2>
                    <h6>{useremail}</h6>
                </div>
                <ul className='d-flex align-items-center p-0 m-0 adm-nal-ul' style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminHome">Dashboard</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminStudent' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminStudent">Student</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(adminLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
            </div>
        </>
     );
}

export default Navbar;