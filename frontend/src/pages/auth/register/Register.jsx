import React, { useEffect, useState } from "react";
import "./register.css";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Navbar from "../navbar/Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../DjangoBaseURL";
import { storeToken, getToken, removeToken, storePayment, getPayment} from "../localStorageService";
import DangerousIcon from '@mui/icons-material/Dangerous';
import { setPayment } from "../../../store/paymentSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUserToken} from '../../../store/authSlice'

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const [serverError, setServerError] = useState({});

  const navigate = useNavigate();
  const disptach = useDispatch();

  const handleSumbit = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${baseURL}/register/`, data);

    if (response?.data?.errors) {
      setServerError(response.data.errors);
    } else {
      // store token in local storage and redux 
      storeToken(response.data.data.token);
      const { access } = getToken();
      disptach(setUserToken(access));

      // store payment in local storage and redux 
      storePayment({email: response.data.data.Msg.email, isDone: false});
      const { email, isDone } = getPayment();
      disptach(setPayment({email:email, isDone:isDone}))

      navigate("/");
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  return (
    <>
      <Navbar />
      <div className="login-form">
        <div className="container">
          <div className="heading">
            <LockOpenOutlinedIcon className="login-icon" />
            <p>Sign up</p>
          </div>
          <form onSubmit={handleSumbit} className="content">
            <input
              type="text"
              name="name"
              placeholder="Username"
              value={data.name}
              onChange={handleChange}
            />
            {serverError.name && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.name}</p>
              </div>
            )}
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
                <p>{serverError.email}</p>
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
                <p>{serverError.password}</p>
              </div>
            )}
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={data.password2}
              onChange={handleChange}
            />
            {serverError.password2 && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.password2}</p>
              </div>
            )}
            <button type="submit">Sign up</button>
            {serverError.non_field_errors && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.non_field_errors}</p>
              </div>
            )}
            <a onClick={() => navigate('/login')}>Already have an account? Sign in</a>
          </form>
        </div>
      </div>
    </>
  );
};

export default Register;
