import React from "react";
import { useState } from "react";
import "./profile.css";
import Navbar from "../navbar/Navbar";
import PaypalCheckoutButton from "../PayPal/PaypalCheckoutButton";

const Profile = () => {

  const product  = {
    description : "Movix Subscription",
    price: 10.99,
  }

  return (
    <>
      <Navbar />

      <div className="profile-page">
        <div className="profile-page-header">
          <div className="heading">See What's next.</div>
          <div className="subheading">
            Stream Unlimited TV Shows and Movies for Just $10.99
          </div>
        </div>
        <div className="payment-button">
          {/* <button>Proceed to Pay </button> */}
          <div>
            <PaypalCheckoutButton product={product}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
