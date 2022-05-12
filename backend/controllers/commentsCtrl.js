const db = require("../models"); // les modèles sequelize
const Comment = db.comments;
const User = db.users;

exports.createComment = (req, res, next) => {
  if (
    !req.body.UserId ||
    !req.body.PublicationId ||
    !req.body.comment ||
    req.body.comment.length > 1500
  ) {
    return res.status(400).json({
      message:
        "one or more paramaters are invalide. Max comment length is 1500",
    });
  } else {
    const comment = new Comment({
      UserId: req.body.UserId,
      PublicationId: req.body.PublicationId,
      comment: req.body.comment,
    });

    comment
      .save()
      .then(() => res.status(201).json({ message: "Commentaire ajouté !" }))
      .catch((error) => res.status(400).json({ error }));
  }
};

// READ

exports.findOneComment = (req, res, next) => {
  Comment.findAll({
    where: {
      PublicationId: req.params.Publicationid,
    },
    include: {
      model: User,
      required: true,
      attributes: ["userName"],
    },
  })
    .then((comment) => {
      res.status(200).json(comment);
    })
    .catch((error) => res.status(404).json({ error }));
};

exports.findAllComments = (req, res, next) => {
  Comment.findAll({
    include: {
      model: User,
      required: true,
      attributes: ["userName", "isActive", "imageProfile"],
    },
    order: [["id", "ASC"]],
  })
    .then((comments) => {
      const listeComments = comments.map((comment) => {
        return Object.assign(
          {},
          {
            id: comment.id,
            createdAt: comment.createdAt,
            comment: comment.comment,
            UserId: comment.UserId,
            PublicationId: comment.PublicationId,
            userName: comment.User.userName,
            isActive: comment.User.isActive,
            imageProfile: comment.User.imageProfile,
          }
        );
      });
      res.status(200).json({ listeComments });
    })
    .catch((error) => res.status(400).json({ error }));
};

// DELETE

// Supprimer un commentaire
exports.deleteComment = (req, res, next) => {
  Comment.destroy({ where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "Commentaire supprimé !" }))
    .catch((error) => res.status(400).json({ error }));
};
