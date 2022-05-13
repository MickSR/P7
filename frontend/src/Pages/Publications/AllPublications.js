import React, { useEffect, useState } from "react";
import AuthService from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../Publications/main.css";
import dayjs from "dayjs";

require("dayjs/locale/fr");
const relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

function AllPublication() {
  useEffect(() => {
    getAllPublications();
  }, []);

  useEffect(() => {
    getComments();
  }, []);

  const [publications, setPublications] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState("");
  const currentUser = AuthService.getCurrentUser();

  let navigate = useNavigate();

  const UserId = JSON.parse(localStorage.getItem("User"))["userId"];

  console.log(publications);

  //Routes GET publications
  const getAllPublications = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:5000/api/publications/`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
    })
      .then((res) => {
        setPublications(res.data.listePublications);
      })
      .catch((err) => {});
  };

  // get all comments of the post
  const getComments = async () => {
    await axios({
      method: "GET",
      url: `http://localhost:5000/api/comments/publications`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
    })
      .then((res) => {
        setComments(res.data.listeComments);
        console.log(res.data.listeComments);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  //send comment
  const sendComment = async (publication) => {
    await axios({
      method: "POST",
      url: `http://localhost:5000/api/comments/`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
      data: {
        UserId,
        PublicationId: publication,
        comment: commentForm,
      },
    })
      .then((res) => {
        setCommentForm("");
        alert("commentaire ajouté!");
      })
      .catch((err) => {
        console.error(err.response);
      });
  };

  //delete comment
  const deleteComm = async (id) => {
    await axios({
      method: "DELETE",
      url: `http://localhost:5000/api/comments/${id}`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
        UserId,
      },
    }).then(() => {
      setComments(
        comments.filter((val) => {
          return val.id !== id;
        })
      );
    });
  };

  //delete publication
  const deletePublication = async (id) => {
    await axios({
      method: "DELETE",
      url: `http://localhost:5000/api/publications/${id}`,
      headers: {
        Authorization:
          "Bearer " + JSON.parse(localStorage.getItem("User"))["token"],
      },
    }).then(() => {
      navigate("/articles");
    });
  };

  if (publications === undefined) {
    return <div>Chargement...</div>;
  } else {
    return (
      <main className="main-wrapper publications">
        <h1>Dernières publications</h1>
        {publications.map((publication, index) => (
          <section className="publications--list" key={index}>
            <article className={`publication data-id="${publication.id}`}>
              <header>
                <div>
                  <img
                    src={publication.imageProfile}
                    alt="Photo de profil"
                  ></img>
                </div>
                <div className="text">
                  <p className="name">{publication.userName}</p>
                  <p className="date">
                    {dayjs(publication.createdAt).locale("fr").fromNow()}
                  </p>
                </div>
                {(UserId === publication.UserId ||
                  currentUser.role ) && (
                  <form className="delete-post" >
                    <input
                      type="hidden"
                      name="publicationId"
                      value={publication.publicationId}
                    />
                    <button
                      type="submit"
                      aria-label="Supprimer la publication"
                      onClick={() => {
                        deletePublication(publication.id);
                      }}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </form>
                )}
              </header>
              <div className="content">
                <p>{publication.publication}</p>
              </div>
              <div>
                <div className="picture">
                  <img
                    src={publication.publicationUrl}
                    alt="Photo de la publication"
                  />
                </div>
              </div>
              <footer >
                <div className="commentslist">
                  <h3>Commentaires</h3>
                  <div className="comments">
                    {comments
                      .filter(
                        (element) => element.PublicationId === publication.id
                      )
                      .map((comment, key) => {
                        return (
                          <div
                            key={key}
                            className={`comments--comment data-id="${comment.PublicationId}`}
                          >
                            <div>
                              <img
                                src={comment.imageProfile}
                                alt={comment.UserId}
                              />
                            </div>
                            <div className="comments--comment--fluid">
                              <p className="title">
                                <span>{comment.userName} </span>
                                {dayjs(comment.createdAt)
                                  .locale("fr")
                                  .fromNow()}
                              </p>
                              <p>{comment.comment}</p>
                            </div>
                            {(UserId === comment.UserId ||
                              currentUser.role) && (
                              <form
                                className="comments--comment--delete"
                                submit=""
                              >
                                <input
                                  type="hidden"
                                  name="commentId"
                                  value={comment.id}
                                />

                                <button
                                  type="submit"
                                  aria-label="Supprimer le commentaire"
                                  onClick={() => {
                                    deleteComm(comment.id);
                                  }}
                                >
                                  <i className="fas fa-trash"></i>
                                </button>
                              </form>
                            )}
                          </div>
                        );
                      })}
                  </div>
                  <form className={`comments--add data-id="${publication.id}`}>
                    <img
                      src={currentUser.imageProfile}
                      alt="Votre photo de profil"
                    />
                    <label htmlFor="'add-comment" className="hidden">
                      Votre commentaire
                    </label>
                    <input
                      type="text"
                      placeholder="Votre commentaire"
                      onChange={(e) => setCommentForm(e.target.value)}
                    />

                    <button
                      type="submit"
                      aria-label="Envoyer"
                      onClick={() => sendComment(publication.id)}
                    >
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </form>
                </div>
              </footer>
            </article>
          </section>
        ))}
      </main>
    );
  }
}

export default AllPublication;
