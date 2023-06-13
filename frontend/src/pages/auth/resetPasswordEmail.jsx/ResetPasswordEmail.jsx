import React, { useState } from "react";
import "./resetPasswordEmail.css";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Navbar from "../navbar/Navbar";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../DjangoBaseURL";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const ResetPasswordEmail = () => {
  const [data, setData] = useState({
    email: "",
  });

  const navigate = useNavigate();

  const [serverError, setServerError] = useState({});
  const [serverData, setServerData] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError({});
    setServerData({});
    setLoading(true);

    const response = await axios.post(`${baseURL}/send-password-reset-email/`, data)

    setLoading(false);
    console.log(response.data)
    if(response.data.errors){
      setServerError(response.data.errors);
      setData({email: ""})
    }
    else{
      setData({email: ""})
      setServerData(response.data.data)  
    }

  };

  const handleOnChange = (event) => {
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
            <p>Send Password URL</p>
          </div>
          <form onSubmit={handleSubmit} className="content">
            {loading ? (
              <ClipLoader
                className="loader"
                color="#fa9e00"
                size="80px"
                loading={loading}
              />
            ) : (
              <input
                type="email"
                name="email"
                placeholder="Email address.."
                value={data.email}
                onChange={handleOnChange}
              />
            )}
            {serverError.email && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon"/>
                <p>{serverError.email[0]}</p>
              </div>
            )}
            <button type="submit">{loading ? "Sending..." : "Send"}</button>
            {serverError.non_field_errors && (
              <div className="errorhandle" >
                <DangerousIcon className="error-icon"/>
                <p>{serverError.non_field_errors[0]}</p>
              </div>
            )}
            {serverData.msg && (
              <div className="successhandle" >
                <CheckBoxIcon className="error-icon"/>
                <p>{serverData.msg}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPasswordEmail;
