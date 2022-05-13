import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import AuthService from "../../services/auth.service";
import EventBus from "../../check/Eventbus";
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const [currentUser, setCurrentUser] = useState({ userId: 0 });

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    if (user) {
      setCurrentUser(user);
    }

    EventBus.on("logout", () => {
      logOut();
    });

    return () => {
      EventBus.remove("logout");
    };
  }, [currentUser.userId]);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
  };

  return (
    <div>
      <nav className="Navbar">
        <div className="Logo">
          <Link to="/">
            <img src={logo} alt="Logo" width="200px" height="auto" />
          </Link>
        </div>
        <div className="Navbar__links">
          {currentUser.userName ? (
            <li className="Navbar__item">
              <Link to="articles">Lire les posts</Link>
              <Link to="publication">Ecrire un post</Link>
            </li>
          ) : null}
        </div>
        {currentUser.userName ? (
          <div className="Navbar__links">
            <li>
              <Link to="profile">Bonjour {currentUser.userName} !</Link>
            </li>
            <li className="Navbar__item">
              <a href="/login" onClick={logOut}>
                Déconnexion
              </a>
            </li>
          </div>
        ) : (
          <div className="Navbar__links">
            <li className="Navbar__item">
              <Link to="login">Se connecter</Link>
            </li>

            <li className="Navbar__item">
              <Link to="register">S'inscrire</Link>
            </li>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;
