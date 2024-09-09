import React from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/BigLogoWhite.png";
import { RoleBasedLinks } from "./RoleBasedLinks/RoleBasedLinks";

export const Navbar = ({ user }) => {
  
  const navigate = useNavigate();

  return (
    <>
      <nav className="navbar-container">
        <div className="form-container-title__logo">
          <div className="logo-container">
            <img src={logo} alt="" className="logo" />
          </div>
        </div>
        <div className="navbar-center">
          <button onClick={() => navigate("/dashboard/personal")}>Informes</button>
          <button onClick={() => navigate("/dashboard/chat")}>Chat</button>
          <button onClick={() => navigate("/dashboard/users")}>Usuarios</button>
          {/* <button onClick={() => navigate("/dashboard/postUser")}>Posts</button> */}
          <button onClick={() => navigate("/dashboard/forums/")}>Forum</button>
        </div>
        <div className="navbar-right">
          <div className="dropdown">
            <button className="dropbtn">{user}</button>
            <RoleBasedLinks />
          </div>
        </div>
      </nav>
    </>
  );
};
