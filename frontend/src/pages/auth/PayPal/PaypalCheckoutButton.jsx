import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import "./paypalCheckoutButton.css";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../DjangoBaseURL";
import { storePayment } from "../localStorageService";
import { setPayment } from "../../../store/paymentSlice";

const PaypalCheckoutButton = (props) => {
  const { product } = props;
  const [paidFor, setpaidFor] = useState(false);
  const [error, setError] = useState(null);
  const accessToken = useSelector((state) => state.auth.accessToken);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const getUserData = async (accessToken) => {
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    axios
      .get(`${baseURL}/profile/`, { headers: headers })
      .then(async (response) => {
        const { email, name } = response.data.data;
        const data = {
          email: email,
          isDone: true,
        };
        const paymentResponse = await axios.put(
          `${baseURL}/payment-update/${email}/`,
          data
        );
        
        const paymentData = await axios.get(`${baseURL}/payment-get/${email}/`);
        storePayment(paymentResponse.data.data);
        dispatch(setPayment(data))

        // if user is already paid then it will give warining and redirect to home page
        if (paymentResponse?.data?.errors) {
          Toast.fire({
            icon: "warning",
            title: "Transaction Failed!",
            text: "Payment already done! Redirecting to home page..",
          });
          navigate("/");
        }
        // if user is not paid then it will give success payment msg and redirect to home page
        else {
          Toast.fire({
            icon: "success",
            title: "Transaction Completed!",
            text: "Enjoy your unlimited TV Shows and Movies",
          });
          navigate("/");
        }
      })
      .catch((error) => {
        Toast.fire({
          icon: "error",
          title: "Transaction Failed!",
          text: "Some error occurred",
        });
      });
  };

  const handleApprove = (orderID) => {
    // if success ->
    setpaidFor(true);

    // if error ->
    // alert ->
  };

  // if payment is successful ->
  if (paidFor) {
    // redirect to user on success page
    getUserData(accessToken);
  }

  // if payment failed ->
  if (error) {
    // redirect to error page
    Toast.fire({
      icon: "error",
      title: "Transaction Failed!",
      text: "Some error occurred",
    });
  }

  return (
    <PayPalButtons
      className="paypal-button"
      style={{
        color: "silver",
        layout: "horizontal",
        height: 48,
        tagline: false,
        shape: "pill",
        label: "pay",
      }}
      createOrder={(data, actions) => {
        return actions.order.create({
          purchase_units: [
            {
              description: product.description,
              amount: {
                value: product.price,
              },
            },
          ],
        });
      }}
      onApprove={async (data, actions) => {
        const order = await actions.order.capture();
        console.log("success", order);

        handleApprove(data.orderID);
      }}
      onError={(error) => {
        setError(error);
        console.log("error", error);
      }}
      onCancel={() => {
        // display cancel page or redirect to user cancel page
      }}
      onClick={(data, actions) => {
        // if user already purchased the subscrtiption then it will triggered
      }}
    />
  );
};

export default PaypalCheckoutButton;
