import React, { useState } from "react";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import login from "../../../assets/login.svg";
import "./login.css";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../DjangoBaseURL";
import { storeToken, getToken} from "../localStorageService";
import DangerousIcon from "@mui/icons-material/Dangerous";
import { useDispatch, useSelector } from 'react-redux'
import { setUserToken } from "../../../store/authSlice";
import { setPayment } from "../../../store/paymentSlice";
import { getPayment } from "../localStorageService";



const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });


  const [serverError, setServerError] = useState({});

  const navigate = useNavigate();

  const disptach = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${baseURL}/login/`, data)
    if (response?.data?.data?.errors) {
      setServerError(response.data.data.errors);
    }
    else if(response?.data?.errors){
      setServerError(response.data.errors);
    }
    else{
      // store token in local storage and redux 
      storeToken(response.data.data.token);
      const { access } = getToken();
      disptach(setUserToken(access));

      // store payment data in redux
      const { email, isDone } = getPayment();
      disptach(setPayment({email:email, isDone:isDone}))
      navigate('/')
    }

  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({...data, [name]: value});
  }

  return (
    <>
      <Navbar />
      <div className="login-form">
        <div className="container">
          <div className="heading">
            <LockOpenOutlinedIcon className="login-icon" />
            <p>Sign in</p>
          </div>
          <form onSubmit={handleSubmit} className="content">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={data.email}
              onChange={handleChange}
            />
            {serverError.email && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.email[0]}</p>
              </div>
            )}
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.password}
              onChange={handleChange}
            />
            {serverError.password && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.password[0]}</p>
              </div>
            )}
            <button type="submit">Login</button>
            {serverError.non_field_errors && (
              <div className="errorhandle" >
                <DangerousIcon className="error-icon"/>
                <p>{serverError.non_field_errors[0]}</p>
              </div>
            )}
            <a onClick={() => navigate('/register')}>Don't have an account? Sign Up</a>
            <a onClick={() => navigate('/reset-password-email')}>Forgot password?</a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
