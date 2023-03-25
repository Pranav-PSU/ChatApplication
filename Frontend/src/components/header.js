import React from "react";
import { Link } from "react-router-dom";
import "./header.css";

const header = () => {
    return (
        <header>
            <div id="nav-bar-container">
                <nav class="nav-bar">
                    <Link to="/" id="logo-container">
                        CHAT APPLICATION
                    </Link>
                    <div id="nav-link-container">
                        <ul class="nav-list">
                            <Link to="/Join" class="nav-link">
                                <li class="nav-list-item">DASHBOARD</li>
                            </Link>
                            <Link to="/chatrooms" class="nav-link">
                                <li class="nav-list-item">CHAT ROOMS</li>
                            </Link>
                        </ul>
                    </div>
                </nav>
            </div>
        </header>
    );
};

export default header;
