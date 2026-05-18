import React, { useContext, useState } from 'react';
import './LoginPopUp.css';
import { assets } from '../../assets/frontend_assets/assets';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const LoginPopUp = ({setShowLogin}) => {

    const {url,setToken} = useContext(StoreContext)
    const [currState,setCurrState] = useState("Login")
    const [otpSent, setOtpSent] = useState(false)
    const [otp, setOtp] = useState("")
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

    const resetSignupFlow = () => {
      setOtpSent(false)
      setOtp("")
    }

    const onLogin = async (event) => {
        event.preventDefault();

        try {
          const response = await axios.post(url + "/api/user/login", data)
          if(response.data.success){
            setToken(response.data.token)
            localStorage.setItem("token",response.data.token)
            setShowLogin(false)
          }
        } catch(err) {
          if (err.response) alert(err.response.data.message || "Login failed")
          else alert("Network or server error")
        }
    }

    const onRegister = async (event) => {
      event.preventDefault();

      try {
        const response = await axios.post(url + "/api/user/register", data)
        if (response.data.success) {
          setOtpSent(true)
          setOtp("")
          alert(response.data.message || "OTP sent to your email")
        }
      } catch (err) {
        if (err.response) alert(err.response.data.message || "Registration failed")
        else alert("Network or server error")
      }
    }

    const onVerifyOtp = async (event) => {
      event.preventDefault();

      try {
        const response = await axios.post(url + "/api/user/verifyOtp", {
          email: data.email,
          otp,
        })

        if (response.data.success) {
          setToken(response.data.token)
          localStorage.setItem("token", response.data.token)
          setShowLogin(false)
        }
      } catch (err) {
        if (err.response) alert(err.response.data.message || "Invalid OTP")
        else alert("Network or server error")
      }
    }

  return (
    <div className='login-popup'>
      <form
        onSubmit={currState === "Login" ? onLogin : otpSent ? onVerifyOtp : onRegister}
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
          <button type='submit'>Verify OTP</button>
        )}

        {/* Toggle Sign Up / Login links */}
        {currState === "Login" ? (
          <p>Create a new account? <span onClick={() => {
            setCurrState("Sign Up");
            resetSignupFlow();
          }}>Click here</span></p>
        ) : (
          <p>Already have an account? <span onClick={() => {
            setCurrState("Login");
            resetSignupFlow();
          }}>Login here</span></p>
        )}
      </form>
    </div>
  );
};

export default LoginPopUp;
