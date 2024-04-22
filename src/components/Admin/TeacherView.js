import {React,useEffect,useState} from 'react';
import '../custom.css';
import { useParams } from 'react-router-dom';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import Navbar from './Navbar';

function TeacherView() {
    const [teacherData, setTeacherData] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [login,setLogin] = useState(null);
    const [logout,setLogout] = useState(null);

    const handleDateChange = date => {
      setSelectedDate(date);
      axios.get(`http://localhost:3001/getTeacherLogDatafromAdmin/${email}/${date.toLocaleDateString()}`)
      .then(response => {
         if(response.data.user.length >= 1){
            setLogin(response.data.user[0].time)
            setLogout(response.data.user[1].time)
         }
         else{
            setLogin('no data')
            setLogout('no data')
         }
          
      })
      .catch(error => {
        console.error('Error fetching admins:', error);
      });
    };

    const { email } = useParams();

    useEffect(()=>{
        axios.get(`http://localhost:3001/getTeacherDetail/${email}`)
        .then(response => {
            setTeacherData(response.data.user[0])
        })
        .catch(error => {
          console.error('Error fetching admins:', error);
        });
    },[email])

    let aa = teacherData?.image?.split('\\');
    aa = aa?.slice(3); 
    aa = aa?.join('/');

    return ( 
        <>
            <Navbar></Navbar>
            <div className='row w-100 justify-content-between align-items-start'>
                {
                teacherData !== null && 
                <div className='col-5 border m-auto rounded p-3 mt-5 position-relative' style={{boxShadow:'0px 0px 15px -5px gray',wordWrap : 'break-word'}}>
                        <p><strong>Full Name :</strong> {teacherData.teacherProfile?.fullname}</p>
                        <p><strong>Email :</strong> {teacherData.email}</p>
                        <p><strong>Mobile Number :</strong> {teacherData.teacherProfile?.contact}</p>
                        <p><strong>Current Role :</strong> {teacherData.teacherProfile?.currentRole}</p>
                        <p><strong>Previous Roles :</strong> {teacherData.teacherProfile?.previousRoles}</p>
                        <p><strong>Age :</strong> {teacherData.teacherProfile?.age}</p>
                        <p><strong>Gender :</strong> {teacherData.teacherProfile?.gender}</p>
                        <p><strong>Father Name :</strong> {teacherData.teacherProfile?.fatherName}</p>
                        <p><strong>Mother Name :</strong> {teacherData.teacherProfile?.motherName}</p>
                        <p className='w-100'><strong>Current Address :</strong> {teacherData.teacherProfile?.currentAddress}</p>
                        <p><strong>Permanent Address :</strong> {teacherData.teacherProfile?.permanentAddress}</p>
                        <p><strong>Marital Status :</strong> {teacherData.teacherProfile?.maritalStatus}</p>
                        <p><strong>Husband Name :</strong> {teacherData.teacherProfile?.husbandName}</p>
                        <p><strong>Childrens :</strong> {teacherData.teacherProfile?.children}</p>
                        <p className='mb-1'><strong>Emergency Contact 1 :</strong></p>
                        <small>Name : {teacherData.teacherProfile?.emergencyContact1?.em_name1}</small> <br/>
                        <small>Relationship : {teacherData.teacherProfile?.emergencyContact1?.em_relationship1}</small> <br/>
                        <small>Contact Number : {teacherData.teacherProfile?.emergencyContact1?.em_mobileNumber1}</small> 
                        <p><strong>Emergency Contact 2 :</strong></p>
                        <small>Name : {teacherData.teacherProfile?.emergencyContact2?.em_name2}</small> <br/>
                        <small>Relationship : {teacherData.teacherProfile?.emergencyContact2?.em_relationship2}</small> <br/>
                        <small>Contact Number : {teacherData.teacherProfile?.emergencyContact2?.em_mobileNumber2}</small> 
                        
                        <div style={{width:'150px',height:'200px',border:'2px solid black',position:'absolute',top:'2%',right:'2%'}}>
                            <img className='w-100 h-100' src={"../"+aa} alt="TeacherImage" />
                        </div>
                        
                </div>
                }
                <div className='col-5 mt-5'>
                    <h4 className='text-decoration-underline'>Log Details</h4>
                    <div>
                        <h2>Select a Date:</h2>
                        <div className='w-75 m-auto'>
                            <Calendar
                            className="bg-info w-75 m-auto"
                                onChange={handleDateChange}
                                value={selectedDate}
                            />
                                  <div>
                            </div>
                        </div>
                        <div className='mt-3'>
                            <table className='table border'>
                                <thead>
                                    <tr>
                                        <td className='border text-center'><strong>Selected Date</strong></td>
                                        <td className='border text-center'><strong>Login</strong></td>
                                        <td className='text-center'><strong>Logout</strong></td>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className='border text-center'>{selectedDate !== null ? selectedDate.toLocaleDateString() : '-'}</td>
                                        <td className='border text-center'>{login}</td>
                                        <td className='text-center'>{logout}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default TeacherView;