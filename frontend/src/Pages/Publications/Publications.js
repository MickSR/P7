import React, { useState } from "react";
import axios from "axios";
import "../Publications/main.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import myimage from "../../assets/send.png";

const Publication = (infos) => {
  const [publication, setPublication] = useState("");
  const UserId = JSON.parse(localStorage.getItem("User"))["userId"];
  const [file, setFile] = useState();
  const navigate = useNavigate();

  // upload image and visuaize it
  const image = document.getElementById("image-container");

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
    reader.readAsDataURL(efile);
  };

  //  save Post in database
  const handlePost = async (e) => {
    e.preventDefault();
    const data = new FormData();
    if (file) data.append("publication", publication);
    data.append("UserId", UserId);
    data.append("image", file);

    await axios({
      method: "POST",
      url: `http://localhost:5000/api/publications/`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
      data,
    })
      .then(() => {
        alert("publication réussie!");
        navigate("/articles");
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  return (
    <div className="container1">
      <div className="row card bg-light m-5 p-3">
        <div className="header p-1">
          <h1 className="btn btn-danger">
            Vous allez créer une nouvelle publication:
            <img src={myimage} className="m-1" alt="send" />
          </h1>
        </div>
        <div className="row">
          <div className="col-12 justify-content-center form-group">
            <label htmlFor="newMessage">
              Donnez des détails sur votre publication.
            </label>
            <textarea
              throwifnamespace="isInvalid = false"
              className="form-control"
              id="newPublication"
              name="publication"
              rows="8"
              placeholder="Saisissez votre message. (1500 caractères max)"
              onChange={(e) => setPublication(e.target.value)}
            ></textarea>
          </div>
        </div>
        <div className="col-12 justify-content-center text-center">
          <img src="" className="w-50 rounded" />
          <p className="text-center">
            un aperçu de votre image apparaîtra ici. Formats acceptés: jpg,
            jpeg, png et gif.
          </p>
        </div>
        <div className="col-12 justify-content-center">
          <div className="form-group justify-content-center">
            <label htmlFor="File">Choisir une nouvelle photo</label>
            <input
              type="file"
              useref="file"
              name="image"
              className="form-control-file"
              id="File"
              accept=".jpg, .jpeg, .gif, .png"
              onChange={pictureLoad}
            ></input>
            <div id="image-container"></div>
          </div>
          <div className="footer col-10 mx-auto align-content-center">
            <div>
              <button
                type="submit"
                className="btn btn-dark btn-block m-2 p-2"
                onClick={handlePost}
              >
                Valider
              </button>
            </div>
            <div>
              <Link to="/articles" className="btn btn-danger btn-block m-2 p-2">
                Annuler/Retour
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Publication;
