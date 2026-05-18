import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopUp = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext)
    const [currState,setCurrState] = useState("Login")
    const [data,setData] = useState({
      name:"",
      email:"",
      password:""
    })


    const onChangeHandler = (event) =>{
      const name = event.target.name
      const value = event.target.value
      setData(data=>({...data,[name]:value}))
    }

    const onLogin = async (event) => {
        try{
            event.preventDefault();
      let newUrl = url;
      if(currState === "Login"){
        newUrl += "/api/user/loginUser"
      }
      else{
        newUrl += "/api/user/register"
      }

      const response = await axios.post(newUrl,data)
      if(response.data.success){
        setToken(response.data.token)
        localStorage.setItem("token",response.data.token)
        setShowLogin(false)
      }
        }
    catch(err) {
      if (err.response) alert(err.response.data.message || "Invalid OTP");
      else alert("Network or server error");
    }
  };

  return (
    <div className='login-popup'>
      <form
        onSubmit={
          currState === "Sign Up" && !otpSent ? onRegister : onLogin
        }
        className="login-popup-container"
      >
        <div className="login-popup-title">
          <h1>{currState}</h1>
          <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
        </div>

        <div className="input-fields">
          {currState === "Sign Up" && !otpSent && (
            <input
              name='name'
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder='Username'
              required
            />
          )}
          <input
            name='email'
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder='Email'
            required
          />
          {currState === "Login" || !otpSent ? (
            <input
              name='password'
              onChange={onChangeHandler}
              value={data.password}
              type="password"
              placeholder='Password'
              required
            />
          ) : null}

          {/* OTP input appears after registration */}
          {otpSent && (
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          )}
        </div>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>By clicking, you agree to our Terms & Conditions</p>
        </div>

        {/* Buttons */}
        {!otpSent ? (
          <button type='submit'>{currState === "Sign Up" ? "Create Account" : "Login"}</button>
        ) : (
          <button type='button' onClick={onVerifyOtp}>Verify OTP</button>
        )}

        {/* Toggle Sign Up / Login links */}
        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => {
            setCurrState("Sign Up");
            setOtpSent(false);
          }}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => {
            setCurrState("Login");
            setOtpSent(false);
          }}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
