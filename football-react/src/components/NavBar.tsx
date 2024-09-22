import React from "react";
import logo from "../assets/images/goal-genius.png";
import styles from "../style/navbar.module.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Calendar from "./pages/Calendar";
import Predictions from "./pages/Predictions";
import Results from "./pages/Results";

const Navbar: React.FC = () => {
  return (
    <Router>
      <nav className="navbar navbar-expand-lg navbar-light">
        <a className="navbar-brand" href="/">
          <img
            className={`shadow-sm rounded ${styles.navimg}`}
            src={logo}
            alt="Goal Genius"
          />
        </a>
        <button
          className="navbar-toggler navbar-dark"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item mx-2">
              <Link className="nav-link" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/predictions">
                Predictions
              </Link>
            </li>
            {/* <li className="nav-item mx-2">
            <a className="nav-link" href="invest">
              Investing
            </a>
          </li> */}
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/results">
                Results
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link" to="/calendar">
                Next Matches
              </Link>
            </li>
            {/* Uncomment the following block if needed */}
            {/* <li className="nav-item mx-2">
            <a className="nav-link" href="contact_submit">Send a comment</a>
          </li> */}
          </ul>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/predictions" element={<Predictions />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </Router>
  );
};

export default Navbar;
