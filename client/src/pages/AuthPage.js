import React, { useState, useEffect, useContext } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";
import { AuthContext } from "../context/AuthContext";

export const AuthPage = () => {
  // auth is taken everything from the AuthContext.Provider inside of the "../App.js"
  // Namely, token, login, logout, userId. Consequently, we can use these methods inside of our AuthPage.
  const auth = useContext(AuthContext);
  const message = useMessage();
  // loading, error, request is taking from "../hooks/http.hooks"
  const { loading, request, error, clearError } = useHttp();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    // Whenever error changes, pass it to a message custom hook.
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    // Making our "Enter email" and "Enter password" fields active by default.
    window.M.updateTextFields();
  }, []);

  const changeHandler = (event) => {
    // event.target.name is inside of our <input name="email" or name="password" />
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      // using our back-end functionality from "../../routes/auth.routes.js"
      //   ...form stands for received email and password.
      const data = await request("/api/auth/register", "POST", { ...form });
      // Show message username has been succesfully created or user already exists with our message hook.
      message(data.message);
      console.log("Data", data);
    } catch (e) {}
  };

  const loginHandler = async () => {
    try {
      // All request from backend to frontend are being passed through "proxy" inside of
      // our package.json file. TODO: Implement another method in production build.
      const data = await request("/api/auth/login", "POST", { ...form });
      // login is defined inside "../hooks/auth.hook.js", it is taking jwtToken and id
      auth.login(data.token, data.userId);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className='row'>
      <div className='col s6 offset-s3'>
        <h1>Shrink a link!</h1>
        <div className='card blue-grey darken-1'>
          <div className='card-content white-text'>
            <span className='card-title'>Authorization</span>
            <div>
              <div className='input-field'>
                <input
                  placeholder='Enter your email'
                  id='email'
                  type='text'
                  name='email'
                  className='yellow-input'
                  value={form.email}
                  onChange={changeHandler}
                />
                <label htmlFor='email'>Email Name</label>
              </div>

              <div className='input-field'>
                <input
                  placeholder='Enter password'
                  id='password'
                  type='password'
                  name='password'
                  className='yellow-input'
                  value={form.password}
                  onChange={changeHandler}
                />
                <label htmlFor='email'>Password</label>
              </div>
            </div>
          </div>
          <div className='card-action'>
            <button
              className='btn yellow darken-4'
              style={{ marginRight: 10 }}
              // Disable button when loading === true
              disable={loading ? 1 : 0}
              onClick={loginHandler}
            >
              Login
            </button>
            <button
              className='btn grey lighten-1.black-text'
              onClick={registerHandler}
              // Disable button when loading === true
              disable={loading ? 1 : 0}
            >
              Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

