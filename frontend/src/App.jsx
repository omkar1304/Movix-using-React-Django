import { useEffect, useState } from "react";
import { fetchDataFromApi } from "./utils/api";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { getApiConfiguration, getGenres } from "./store/HomeSlice";
import Home from "./pages/home/Home";
import Details from "./pages/details/Details";
import SearchResult from "./pages/searchResult/SearchResult";
import Explore from "./pages/explore/Explore";
import PageNotFound from "./pages/404/PageNotFound";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";
import ResetPassword from "./pages/auth/resetPassword/ResetPassword";
import ResetPasswordEmail from "./pages/auth/resetPasswordEmail.jsx/ResetPasswordEmail";
import {
  getPayment,
  getToken,
  storePayment,
} from "./pages/auth/localStorageService";
import { setUserToken } from "./store/authSlice";
import axios from "axios";
import baseURL from "./pages/auth/DjangoBaseURL";
import { setUserInfo } from "./store/userSlice";
import Profile from "./pages/auth/profile/Profile";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { setPayment } from "./store/paymentSlice";

function App() {
  const { url, genres } = useSelector((state) => state.home);
  const dispatch = useDispatch();


  const fetchApiConfig = () => {
    fetchDataFromApi("/configuration").then((res) => {
      const url = {
        backdrop: res.images.secure_base_url + "original",
        poster: res.images.secure_base_url + "original",
        profile: res.images.secure_base_url + "original",
      };

      dispatch(getApiConfiguration(url));
    });
  };

  const genresCall = async () => {
    let promises = [];
    let endPoints = ["tv", "movie"];
    let allGenres = {};

    endPoints.forEach((url) => {
      promises.push(fetchDataFromApi(`/genre/${url}/list`));
    });

    const data = await Promise.all(promises);

    data.map(({ genres }) => {
      return genres.map((item) => (allGenres[item.id] = item));
    });

    dispatch(getGenres(allGenres));
  };

  const tokenHandling = () => {
    const { access, refresh } = getToken();
    if (access) {
      dispatch(setUserToken(access));
    }
  };

  const accessToken = useSelector((state) => state.auth.accessToken);
  
  const paymentHandle = () => {
    if(getPayment() != null){
      const { email, isDone } = getPayment();
      dispatch(setPayment({email:email, isDone:isDone}))
    }
  }
 

  useEffect(() => {
    fetchApiConfig();
    genresCall();
    tokenHandling();
    paymentHandle(); 
  }, [accessToken]);


  const { email, isDone } = useSelector((state) => state.payment)
  

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "ASeWJNDUgEokInA1bEbtgjJ0dmOJP9KNc4qQsH3GSEfYnHWstuFrnUsJtkrcGpsy4D4vOoGtMu77DHkg",
      }}
    >
      <Router>
        <Routes>
          <Route path="/" element={accessToken ? <Home /> : <Login />} />
          <Route
            path="/:mediaType/:id"
            element={isDone == true? <Details /> : <Profile />}
          />
          <Route
            path="/search/:query"
            element={isDone == true? <SearchResult /> : <Profile />}
          />
          <Route
            path="/explore/:mediaType"
            element={isDone == true? <Explore /> : <Profile />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/reset-password/:id/:token"
            element={<ResetPassword />}
          />
          <Route
            path="/reset-password-email"
            element={<ResetPasswordEmail />}
          />
          <Route
            path="/profile"
            element={isDone == true ? <Home/> : accessToken ? <Profile/> : <Login />}
          />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Router>
    </PayPalScriptProvider>
  );
}

export default App;
