import React, { useEffect } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { studentLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

function StudentNavbar() {

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
                <ul className='d-flex align-items-center p-0 m-0 stNav-ul' style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/studentHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/studentHome">Home</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentHomework' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentHomework">HomeWork</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentTimeTable' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentTimeTable">TimeTable</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentResult' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentResult">Result</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/studentChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/studentChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(studentLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
            </div>
        </>
     );
}

export default StudentNavbar;