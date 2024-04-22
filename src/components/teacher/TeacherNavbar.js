import React from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { teacherLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

function TeacherNavbar() {
    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);

    const location = useLocation(); 
    const dispatch = useDispatch();
    return ( 
        <>
            <div className='px-5 mb-5 bg-primary text-white py-1 d-flex justify-content-between'>
                <div>
                    <h2 className='text-start mb-0'>Welcome {username}</h2>
                    <h6>{useremail}</h6>
                </div>
                <ul className='d-flex justify-content-between align-items-center p-0 m-0 t-nav-ul' style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherHome">Home</Link></li>
                    <li className='cursor-pointer nav-opt'><Link nk className={`text-white ${location.pathname === '/teacherProfile' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherProfile">Profile</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherTimeTable' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherTimeTable">TimeTable</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(teacherLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
            </div>
        </>
     );
}

export default TeacherNavbar;