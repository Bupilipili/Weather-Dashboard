import React from 'react';
import { IoIosArrowBack } from 'react-icons/io';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <nav>
      <div className="nav-container">
        <Link to="/">
          <IoIosArrowBack className='nav-icon' size={32} color="grey" />
        </Link>
        <p className="navhead">Weather Dashboard</p>
      </div>
    </nav>
  );
}

export default Navigation;
