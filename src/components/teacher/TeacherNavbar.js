import React, { useState } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { teacherLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft ,faBars} from '@fortawesome/free-solid-svg-icons';

function TeacherNavbar() {
    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);

    const location = useLocation(); 
    const dispatch = useDispatch();
    const [nbVisible,setNbVisible] = useState(false)

    function toggleNav(){
        if(nbVisible === false){
            setNbVisible(true)
        }
        else{
            setNbVisible(false)
        }
    }
    return ( 
        <section className='bg-primary position-relative'>
            <div className='mb-5 bg-primary text-white py-1 d-flex justify-content-between m-auto' style={{width:'95%'}}>
                <div>
                    <h2 className='text-start mb-0'>Welcome <strong>{username}</strong></h2>
                </div>
                <div className='phone-mobile-nav'>
                    <FontAwesomeIcon icon={faBars} className='ms-2' onClick={toggleNav}/>
                </div>
                <ul className={(nbVisible === true) ? 'd-block align-items-center m-0 nav-ul-ph-tab':'d-none align-items-center m-0 nav-ul-ph-tab'} style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherHome">Home</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherProfile' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherProfile">Profile</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherTimeTable' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherTimeTable">TimeTable</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(teacherLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
                <ul className='align-items-center p-0 m-0 t-nav-ul' style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherHome">Home</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherProfile' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherProfile">Profile</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherTimeTable' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherTimeTable">TimeTable</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/teacherChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/teacherChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(teacherLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
            </div>
        </section>
     );
}

export default TeacherNavbar;