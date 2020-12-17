import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { useRoutes } from "./routes";
import { useAuth } from "./hooks/auth.hook";
import { AuthContext } from "./context/AuthContext";
import { Navbar } from "./components/Navbar";
import { Loader } from "./components/Loader";
import "materialize-css";

function App() {
  const { token, login, logout, userId, ready } = useAuth();
  // Checking whether user is authenticated or not, by providing token. !! is a boolean transformation.
  // Our token can take only two values true or false, and based on that we will make further render.
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated);

  if (!ready) {
    return <Loader />;
  }

  return (
    // Using context in order to store user and share it among the whole application.
    <AuthContext.Provider
      value={{ token, login, logout, userId, isAuthenticated }}
    >
      <Router>
        {/* Render Navbar when authenticated */}
        {isAuthenticated && <Navbar />}
        <div className='container'>{routes}</div>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;

