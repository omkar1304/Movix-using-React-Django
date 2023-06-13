import React from 'react'
import './navbar.css'
import logo from '../../../assets/movix-logo.svg'
import ContentWrapper from '../../../components/contentWrapper/ContentWrapper'

const Navbar = () => {
  return (
    <header className="header">
      <ContentWrapper>
        <div className="logo" onClick={() => navigate('/')}>
          <img src={logo} alt="header-img" />
        </div>
      </ContentWrapper>
    </header>
  )
}

export default Navbar