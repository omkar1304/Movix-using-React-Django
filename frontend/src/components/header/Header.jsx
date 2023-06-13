import "./header.scss";
import ContentWrapper from "../contentWrapper/ContentWrapper";
import logo from "../../assets/movix-logo.svg";
import React, { useState, useEffect } from "react";
import { HiOutlineSearch } from "react-icons/hi";
import { SlMenu } from "react-icons/sl";
import { VscChromeClose } from "react-icons/vsc";
import { useNavigate, useLocation } from "react-router-dom";
import LogoutIcon from '@mui/icons-material/Logout';
import { removeToken } from "../../pages/auth/localStorageService";
import { useDispatch } from "react-redux";
import { unSetUserToken } from "../../store/authSlice";
import { unsetUserInfo } from "../../store/userSlice";

const Header = () => {
  // to handle nav bar based on lastScrollY to store scroll value and show to apply css -> top/show/hide
  const [show, setShow] = useState("top");
  const [lastScrollY, setLastScrollY] = useState(0);
  // to check if mobile menun is opened or not
  const [mobileMenu, setMobileMenu] = useState(false);
  // to open/close search field
  const [showSearch, setShowSearch] = useState("");
  // to store query value
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0,0);
  }, [location])

  const controlNavbar = () => {
    if (window.scrollY > 200) {
        if (window.scrollY > lastScrollY && !mobileMenu) {
            setShow("hide");
        } else {
            setShow("show");
        }
    } else {
        setShow("top");
    }
    setLastScrollY(window.scrollY);
};

  useEffect(() => {
    window.addEventListener("scroll", controlNavbar);
    return () => {
        window.removeEventListener("scroll", controlNavbar);
    };
}, [lastScrollY]);

  const searchQueryHandler = (event) => {
    if (event.key === "Enter" && query.length > 0) {
      navigate(`/search/${query}`);
      setTimeout(() => {
        setShowSearch(false);
      }, 1000);
    }
  };

  const openSearch = () => {
    setMobileMenu(false);
    setShowSearch(true);
  };

  const openMobileMenu = () => {
    setMobileMenu(true);
    setShowSearch(false);
  };

  const navigtaionHandlder = (type) => {
    if (type === "movie") {
      navigate("/explore/movie");
    } else {
      navigate("/explore/tv");
    }
    setMobileMenu(false);
  };

  const handleLogout = () => {
    dispatch(unSetUserToken);
    dispatch(unsetUserInfo);
    removeToken();
    navigate('/login');
  }

  return (
    <header className={`header ${mobileMenu ? "mobileView" : ""} ${show}`}>
      <ContentWrapper>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="header-img" />
        </div>
        <ul className="menuItems">
          <li className="menuItem" onClick={() => navigtaionHandlder("movie")}>
            Movies
          </li>
          <li className="menuItem" onClick={() => navigtaionHandlder("tv")}>
            TV Shows
          </li>
          <li className="menuItem" onClick={handleLogout}>
          <abbr title="Logout"><LogoutIcon/></abbr>
          </li>
          <li className="menuItem">
            <HiOutlineSearch onClick={openSearch} />
          </li>
        </ul>
        <div className="mobileMenuItems">
          <HiOutlineSearch onClick={openSearch} />
          {mobileMenu ? (
            <VscChromeClose
              onClick={() => {
                setMobileMenu(false);
              }}
            />
          ) : (
            <SlMenu onClick={openMobileMenu} />
          )}
        </div>
      </ContentWrapper>
      {showSearch && (
        <div className="searchBar">
          <ContentWrapper>
            <div className="searchInput">
              <input
                type="text"
                placeholder="Search for a movie or tv show..."
                onChange={(event) => setQuery(event.target.value)}
                onKeyUp={searchQueryHandler}
              />
              <VscChromeClose onClick={() => setShowSearch(false)} />
            </div>
          </ContentWrapper>
        </div>
      )}
    </header>
  );
};

export default Header;
