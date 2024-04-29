import React, { useEffect, useState } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { studentLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft ,faBars} from '@fortawesome/free-solid-svg-icons';

function StudentNavbar() {

    const username = useSelector((state) => state.user.username);
    const useremail = useSelector((state) => state.user.email);
    const [nbVisible,setNbVisible] = useState(false)
 
    const location = useLocation(); 
    const dispatch = useDispatch();

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
            <div className='mb-5 text-white py-1 d-flex justify-content-between m-auto' style={{width:'95%'}}>
                <div className='d-flex justify-content-center align-items-center'>
                    <h2 className='text-start mb-0 welcomeH2'>Welcome <strong>{username}</strong></h2>
                </div>
                <div className='phone-mobile-nav'>
                    <FontAwesomeIcon icon={faBars} className='ms-2' onClick={toggleNav}/>
                </div>
                <ul className={(nbVisible === true) ? 'd-block align-items-center m-0 nav-ul-ph-tab':'d-none align-items-center m-0 nav-ul-ph-tab'} style={{listStyle:'none'}}>
                    <li onClick={toggleNav} className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/studentHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/studentHome">Home</Link></li>
                    <li onClick={toggleNav} className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentHomework' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentHomework">HomeWork</Link></li>
                    <li onClick={toggleNav} className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentTimeTable' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentTimeTable">TimeTable</Link></li>
                    <li onClick={toggleNav} className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/StudentResult' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/StudentResult">Result</Link></li>
                    <li onClick={toggleNav} className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/studentChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/studentChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(studentLogin(false))
                        setNbVisible(false)
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
                <ul className='align-items-center p-0 m-0 stNav-ul' style={{listStyle:'none'}}>
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
        </section>
     );
}

export default StudentNavbar;