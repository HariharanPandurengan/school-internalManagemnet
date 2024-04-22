import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function TeacherProtectedRoute() {
  
    var user = useSelector((state) => state.user.teacherLogin);
    return ( 
        user ? <Outlet></Outlet> : <Navigate to="/teacher"></Navigate>
     );
}

export default TeacherProtectedRoute;