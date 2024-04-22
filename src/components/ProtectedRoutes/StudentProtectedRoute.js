import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function StudentProtectedRoute() {
  
    var user = useSelector((state) => state.user.studentLogin);
    return ( 
        user ? <Outlet></Outlet> : <Navigate to="/student"></Navigate>
     );
}

export default StudentProtectedRoute;