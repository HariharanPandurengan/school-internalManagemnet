import React, { useEffect, useState } from 'react';
import '../custom.css';
import { useLocation,Link } from "react-router-dom";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useDispatch } from "react-redux";
import { adminLogin } from '../store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft ,faBars} from '@fortawesome/free-solid-svg-icons';

function Navbar() {

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
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminHome">Dashboard</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminStudent' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminStudent">Student</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(adminLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
                <ul className='align-items-center p-0 m-0 adm-nal-ul' style={{listStyle:'none'}}>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminHome' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminHome">Dashboard</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminStudent' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminStudent">Student</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminClasses' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminClasses">Classes</Link></li>
                    <li className='cursor-pointer nav-opt'><Link className={`text-white ${location.pathname === '/adminChangePassword' ? 'text-decoration-underline' : 'text-decoration-none'}`} to="/adminChangePassword">Passowrd</Link></li>
                    <li style={{cursor:'pointer',boxShadow:'0px 0px 5px 0px white'}} className='text-white bg-danger p-1' onClick={()=>{
                        dispatch(adminLogin(false))
                    }}>Logout<FontAwesomeIcon icon={faArrowAltCircleLeft} className='ms-2'/></li>
                </ul>
            </div>
        </section>
     );
}

export default Navbar;