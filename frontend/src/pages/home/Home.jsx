import React, { useEffect } from "react";
import "./home.scss";
import HeroBanner from "./heroBanner/HeroBanner";
import Trending from "./trending/Trendings";
import Popular from "./popular/Popular";
import TopRated from "./topRated/TopRated";
import Header from "../../components/header/Header";
import Footer from "../../components/footer/Footer";
import axios from "axios";
import baseURL from "./../auth/DjangoBaseURL";
import { setUserInfo } from "../../store/userSlice";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getUserData = async (accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get(`${baseURL}/profile/`, { headers: headers })
      .then((response) => {
        const { email, name } = response.data.data;
        dispatch(setUserInfo({ email: email, name: name }));
      })
      .catch((error) => {
        console.log(error);
        navigate("/login");
      });
  };

  const accessToken = useSelector((state) => state.auth.accessToken);
  getUserData(accessToken);

  useEffect(() => {
    getUserData(accessToken);
  }, [accessToken])

  return (
    <div className="homePage">
      <Header />
      <HeroBanner />
      <Trending />
      <Popular />
      <TopRated />
      <Footer />
    </div>
  );
};

export default Home;
