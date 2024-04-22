import React from "react";
import { Outlet,Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function ProtectedRoute() {
       
  
    var user = useSelector((state) => state.user.adminLogin);
    return ( 
        user ? <Outlet></Outlet> : <Navigate to="/"></Navigate>
     );
}

export default ProtectedRoute;