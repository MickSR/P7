import React, { useEffect, useState, useRef, Component } from "react";
import axios from "axios";
import AuthService from "../../services/auth.service";
import { Link } from "react-router-dom";

import "./Profile.css";

const Profile = () => {

  const [file, setFile] = useState();
  const image = document.getElementById("image-container");

  const handleDelete = () => {
    const id = JSON.parse(localStorage.getItem("User"))["userId"];
    if (window.confirm("Voulez vous vraiment supprimer votre compte ?")) {
      axios
        .delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization:
              "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
          },
        })
        .then(() => {
          localStorage.clear();
          window.location.href = "/login";
        })
        .catch((err) => {
          console.error(err);
          window.alert(
            "Une erreur est survenue, veuillez réessayer plus tard. Si le problème persiste, contactez l'administrateur du site"
          );
        });
    }
  };

  const pictureLoad = (e) => {
    const efile = e.target.files[0];
    setFile(efile);
    const reader = new FileReader();
    reader.onload = function (e) {
      const dataUrl = e.target.result;
      const img = document.createElement("img");
      if (document.getElementById("my-image")) {
        image.removeChild(document.getElementById("my-image"));
      }
      img.id = "my-image";
      img.src = dataUrl;
      image.appendChild(img);
    };
  };

  //  save Post in database
  const handlePost = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    if (file) data.append("profil_image", file);
    const id = JSON.parse(localStorage.getItem("User"))["userId"];

    await axios({
      method: "PUT",
      url: `http://localhost:5000/api/users/${id}`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
      data,
    })
      .then((res) => {
        alert("Modification réussie! veuillez vous reconnectez");
        localStorage.clear();
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  const currentUser = AuthService.getCurrentUser();

  if (!currentUser.role) {
    currentUser.role = "Utilisateur";
  } else {
    currentUser.role = "Administrateur";
  }
  return (
    <div className="container">
      <div className="profile--top">
        <div className="image-uploader">
          <label htmlFor="file-input">
            <img
              src={currentUser.imageProfile}
              alt={currentUser.userName}
              className="profile-picture"
            />
          </label>
          <div className="divEditProfile">
            <h2>
              <strong>Modifier la photo de profil : </strong>
            </h2>
            <form id="formFile" encType="multipart/form-data">
              <label>Choisir un fichier : </label>
              <input
                id="file"
                type="file"
                className="file"
                name="file"
                accept=".jpg, .jpeg, .png, .gif"
                onChange={pictureLoad}
              />

              <button onClick={handlePost}> Sauvegarder </button>
            </form>
          </div>

          <header>
            <div className="information">
              <h1>
                <strong>Espace personnel de {currentUser.userName}</strong>
              </h1>
              <p>
                <strong>Votre numéro identifiant :</strong> {currentUser.userId}
              </p>
              <p>
                <strong>Votre adresse mail :</strong> {currentUser.email}
              </p>
              <p>
                <strong>Votre rôle sur la plateforme :</strong>{" "}
                {currentUser.role}
              </p>
            </div>
          </header>
          <div className="delete">
            <h2>
              <strong>Supprimer mon compte</strong>
            </h2>
            <button className="btn btn-danger" onClick={handleDelete}>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
