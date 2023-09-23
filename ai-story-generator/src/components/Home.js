import React from 'react';
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css';
import './custom.css';

const HomePage = () => {
  return (
    <div className="container-fluid glowing-back text-white min-vh-100 d-flex flex-column justify-content-center align-items-center">
      <div>
        <h1 className='display-1'>Welcome to AI story Generator</h1>
      </div>
        <div className="mt-4">
          <Link to='login' className="btn text-light border btn-lg me-3">Login</Link>
          <Link to="/userhome" className="btn text-light border btn-lg me-3 ">UserHome</Link>
          <Link to='feed' className="btn text-light border btn-lg me-3">Feed</Link>
          <Link to='leaderboard' className="btn text-light border btn-lg">Leader Board</Link>
        </div>
    </div>
  );
};

export default HomePage;
