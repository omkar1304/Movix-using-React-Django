import React from "react";
import "./footer.scss";
import { FaFacebookF, FaInstagram, FaGithub, FaLinkedin } from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <ul className="menuItems">
          <li className="menuItem">Terms Of Use</li>
          <li className="menuItem">Privacy-Policy</li>
          <li className="menuItem">About</li>
          <li className="menuItem">Blog</li>
          <li className="menuItem">FAQ</li>
        </ul>
        <div className="infoText">
          Enjoy your favorite movies and TV shows with Movix - your ultimate entertainment destination.
        </div>
        <div className="socialIcons">
          <a
            href="https://www.facebook.com/omkar.pedamkar.79/"
            style={{ color: "white" }}
            target="_blank"
          >
            <span className="icon">
              <FaFacebookF />
            </span>
          </a>
          <a
            href="https://www.instagram.com/omkar_pedamkar13/"
            style={{ color: "white" }}
            target="_blank"
          >
            <span className="icon">
              <FaInstagram />
            </span>
          </a>
          <a
            href="https://github.com/omkar1304"
            style={{ color: "white" }}
            target="_blank"
          >
            <span className="icon">
              <FaGithub />
            </span>
          </a>
          <a
            href="https://www.linkedin.com/in/omkar-pedamkar/"
            style={{ color: "white" }}
            target="_blank"
          >
            <span className="icon">
              <FaLinkedin />
            </span>
          </a>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
