import React, { useEffect, useState } from "react";
import "./resetPassword.css";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import Navbar from "../navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import baseURL from "../DjangoBaseURL";
import DangerousIcon from "@mui/icons-material/Dangerous";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import Swal from "sweetalert2";

const ResetPassword = () => {

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  const [data, setData] = useState({
    password: "",
    password2: "",
  });

  const navigate = useNavigate();

  const [serverError, setServerError] = useState({});
  const [serverData, setServerData] = useState({});

  const { id, token } = useParams();

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data);
    const response = await axios.post(
      `${baseURL}/reset-password/${id}/${token}/`,
      data
    );

    console.log(response.data);

    if (response.data.errors) {
      setServerError(response.data.errors);
    } else {
      setServerError({});
      setServerData(response.data.data);
      Toast.fire({
        icon: "success",
        title: "Password has been reset",
        text: "Redirecting to login page...",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
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
            <p>Reset Password</p>
          </div>
          <form onSubmit={handleSubmit} className="content">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={data.email}
              onChange={handleOnChange}
            />
            {serverError.password && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon" />
                <p>{serverError.password}</p>
              </div>
            )}
            <input
              type="password"
              name="password2"
              placeholder="Confirm Password"
              value={data.email}
              onChange={handleOnChange}
            />
            {serverError.password2 && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon" />
                <p>{serverError.password2}</p>
              </div>
            )}
            <button type="submit">Submit</button>
            {serverError.non_field_errors && (
              <div className="errorhandle">
                <DangerousIcon className="error-icon" />
                <p>{serverError.non_field_errors}</p>
              </div>
            )}
            {serverData.msg && (
              <div className="successhandle">
                <CheckBoxIcon className="error-icon" />
                <p>{serverData.msg}</p>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
