import {configureStore,createSlice} from '@reduxjs/toolkit'

const initialState = {
    adminLogin:false,
    teacherLogin:false,
    studentLogin:false,
    username:'',
    email:'',
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers:{
        adminLogin:(state, action)=>{
            state.adminLogin = action.payload;
        },
        teacherLogin:(state, action)=>{
            state.teacherLogin = action.payload;
        },
        studentLogin:(state, action)=>{
            state.studentLogin = action.payload;
        },
        userDetails:(state, action)=>{
            const { username, email } = action.payload;
            state.username = username;
            state.email = email;
        },
    }
});

export const {adminLogin,teacherLogin,studentLogin,userDetails} = userSlice.actions; //useDispatch

export const store =  configureStore({ //useSelector
    reducer: {
        user:userSlice.reducer
    }
});