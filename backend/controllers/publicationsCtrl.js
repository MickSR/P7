const models = require("../models");
const Publication = models.publications;
const Comment = models.comments;
const User = models.users;
const fs = require("fs");

// Toutes les publications
exports.findAllPublications = (req, res, next) => {
  Publication.findAll({
    include: {
      model: User,
      required: true,
      attributes: ["userName", "isActive", "imageProfile"],
    },
    order: [["id", "DESC"]],
  })
    .then((publications) => {
      console.log(publications);
      const listePublications = publications.map((publication) => {
        return Object.assign(
          {},
          {
            id: publication.id,
            createdAt: publication.createdAt,
            publication: publication.publication,
            publicationUrl: publication.publicationUrl,
            UserId: publication.UserId,
            userName: publication.User.userName,
            isActive: publication.User.isActive,
            imageProfile: publication.User.imageProfile,
          }
        );
      });
      res.status(200).json({ listePublications });
    })
    .catch((error) => res.status(400).json({ error }));
};

// Tous les publications d'un utilisateur
exports.findAllPublicationsForOne = (req, res, next) => {
  Publication.findAll({
    where: { UserId: req.params.id },
    include: {
      model: User,
      required: true,
      attributes: ["userName", "isActive"],
    },
    order: [["id", "DESC"]],
  })
    .then((publications) => {
      const ListePublications = publications.map((publication) => {
        return Object.assign(
          {},
          {
            id: publication.id,
            createdAt: publication.createdAt,
            publication: publication.publication,
            publicationUrl: publication.publicationUrl,
            UserId: publication.UserId,
            userName: publication.User.userName,
            isActive: publication.User.isActive,
          }
        );
      });
      res.status(200).json({ ListePublications });
    })
    .catch((error) => res.status(400).json({ error }));
};

// Une seule publication
exports.findOnePublication = (req, res, next) => {
  const onePublication = {};
  Publication.findOne({
    where: { id: req.params.id },
    include: {
      model: User,
      required: true,
      attributes: ["userName", "isActive"],
    },
  })
    .then((publication) => {
      onePublication.id = publication.id;
      onePublication.userId = publication.UserId;
      onePublication.userName = publication.User.userName;
      onePublication.isActive = publication.User.isActive;
      onePublication.createdAt = publication.createdAt;
      onePublication.publication = publication.publication;
      onePublication.publicationUrl = publication.publicationUrl;
    })
    .then(() => {
      Comment.count({ where: { PublicationId: req.params.id } }).then(
        (commentCount) => {
          onePublication.commentaire = commentCount;
          res.status(200).json(onePublication);
        }
      );
    })
    .catch((error) => res.status(404).json({ error }));
};

// Créer une publication
exports.createPublication = (req, res, next) => {
  let imagePost = "";
  if (req.file.filename) {
    imagePost = `${req.protocol}://${req.get("host")}/images/publications/${
      req.file.filename
    }`;
  }

  const publication = new Publication({
    UserId: req.body.UserId,
    publication: req.body.publication,
    publicationUrl: imagePost,
  });
  publication
    .save()
    .then(() => res.status(201).json({ publication: "Publication créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Modifier une publication
exports.modifyPublication = (req, res, next) => {
  const publicationObject = req.file
    ? {
        ...req.body.publication,
        publicationUrl: `${req.protocol}://${req.get(
          "host"
        )}/images/publications/${req.file.filename}`,
      }
    : { ...req.body };

  Publication.update(
    { ...publicationObject, id: req.params.id },
    { where: { id: req.params.id } }
  )
    .then(() => res.status(200).json({ message: "Publication modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer une publication
exports.deletePublication = (req, res) => {
  Publication.findOne({ where: { id: req.params.id } })
    .then((publication) => {
      const filename = publication.publicationUrl.split(
        "/images/publications/"
      )[1];
      fs.unlink(`images/publications/${filename}`, () => {
        Publication.destroy({ where: { id: req.params.id } });
        Comment.destroy({ where: { id: req.params.id } })
          .then(() => {
            res.status(201).json({ message: "Post supprimé." });
          })
          .catch((error) =>
            res
              .status(400)
              .json({ message: "Impossible de supprimer ce post. " + error })
          );
      });
    })
    .catch((error) => res.status(500).json({ message: "Erreur. " + error }));
};
