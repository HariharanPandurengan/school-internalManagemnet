import React from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { store } from "./components/store";
import {Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoutes/ProtectedRoute"
import AdminLogin from "./components/Admin/Index";
import AdminLandingPage from "./components/Admin/Home"
import AdminStudent from "./components/Admin/Student"
import TeacherView from './components/Admin/TeacherView';
import AdminClasses from './components/Admin/Classes';
import AdminClass from './components/Admin/Class';
import AdminChangePassword from './components/Admin/ChangePassword';

import TeacherProtectedRoute from "./components/ProtectedRoutes/TeacherProtectedRoute"
import TeacherLogin from "./components/teacher/Index";
import TeacherLandingPage from "./components/teacher/Home"
import TeacherProfile from './components/teacher/TeacherProfile';
import Students from './components/teacher/Students';
import TeacherTimeTable from './components/teacher/TimeTable';
import Attendance from './components/teacher/Attendance';
import TeacherResult from './components/teacher/Result';
import TeacherClasses from './components/teacher/Classes';
import TeacherClass from './components/teacher/Class';
import TeacherChangePassword from './components/teacher/ChangePassword';
import StudentView from './components/teacher/StudentView';

import StudentLogin from "./components/student/Index";
import StudentLandingPage from './components/student/Home';
import StudentTimeTable from './components/student/TimeTable';
import StudentResult from './components/student/Result';
import StudentProtectedRoute from './components/ProtectedRoutes/StudentProtectedRoute';
import Homework from './components/student/Homework';
import StudentChangePassword from './components/student/ChangePassword';

function App() {
 
  return (
    <>
      <Provider store={store}>
        <Routes>
            <Route path="/" element={<AdminLogin></AdminLogin>}></Route>
            <Route element={<ProtectedRoute></ProtectedRoute>}>
              <Route path="/adminHome" element={<AdminLandingPage></AdminLandingPage>}></Route>
              <Route path="/teacherView/:email" element={<TeacherView></TeacherView>}></Route>
              <Route path="/adminStudent" element={<AdminStudent></AdminStudent>}></Route>
              <Route path="/AdminClasses" element={<AdminClasses></AdminClasses>}></Route>
              <Route path="/adminclass/:className" element={<AdminClass></AdminClass>}></Route>
              <Route path="/adminChangePassword" element={<AdminChangePassword></AdminChangePassword>}></Route>
              <Route path="/studentView/:email" element={<StudentView></StudentView>}></Route>
            </Route>

            <Route path="/teacher" element={<TeacherLogin></TeacherLogin>}></Route>
            <Route element={<TeacherProtectedRoute></TeacherProtectedRoute>}>
              <Route path="/teacherHome" element={<TeacherLandingPage></TeacherLandingPage>}></Route>
              <Route path="/teacherProfile" element={<TeacherProfile></TeacherProfile>}></Route>
              <Route path="/teacherStudent" element={<Students></Students>}></Route>
              <Route path="/teacherTimeTable" element={<TeacherTimeTable></TeacherTimeTable>}></Route>
              <Route path="/Attendance" element={<Attendance></Attendance>}></Route>
              <Route path="/teacherResult" element={<TeacherResult></TeacherResult>}></Route>
              <Route path="/TeacherClasses" element={<TeacherClasses></TeacherClasses>}></Route>
              <Route path="/teacherClass/:className" element={<TeacherClass></TeacherClass>}></Route>
              <Route path="/teacherChangePassword" element={<TeacherChangePassword></TeacherChangePassword>}></Route>
              <Route path="/studentView/:email" element={<StudentView></StudentView>}></Route>
            </Route>

            <Route path="/student" element={<StudentLogin></StudentLogin>}></Route>
            <Route element={<StudentProtectedRoute></StudentProtectedRoute>}>
              <Route path="/studentHome" element={<StudentLandingPage></StudentLandingPage>}></Route>
              <Route path="/StudentTimeTable" element={<StudentTimeTable></StudentTimeTable>}></Route>
              <Route path="/StudentResult" element={<StudentResult></StudentResult>}></Route>
              <Route path="/StudentHomework" element={<Homework></Homework>}></Route>
              <Route path="/studentChangePassword" element={<StudentChangePassword></StudentChangePassword>}></Route>
            </Route>
        </Routes>
      </Provider>
    </>
  );
}

export default App;
