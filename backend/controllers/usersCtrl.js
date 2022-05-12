const db = require("../models");
const User = db.users;
const Publication = db.publications;
const Comment = db.comments;

// Trouver un utilisateur
exports.GetProfile = (req, res, next) => {
  const user = {};
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      user.userName;
      user.email;
      if (user.isAdmin == false) {
        user.role = "Utilisateur";
      } else {
        user.role = "Administrateur";
      }
      user.createdAt = user.createdAt;
    })
    .then(() => {
      Comment.count({ where: { userId: req.params.id } }).then((cmtcount) => {
        user.commentsCount = cmtcount;
      });
    })
    .then(() => {
      Publication.count({ where: { userId: req.params.id } }).then(
        (pbccount) => {
          user.publicationsCount = pbccount;
          res.status(200).json(user);
        }
      );
    })
    .catch((error) => res.status(404).json({ error }));
};

// Modifier un utilisateur
exports.modifyUser = (req, res, next) => {
  const userObject = req.file
    ? {
        ...req.body.imageProfile,
        imageProfile: `${req.protocol}://${req.get("host")}/images/profils/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  User.update(
    { ...userObject, id: req.params.id },
    { where: { id: req.params.id } }
  )
    .then(() => res.status(200).json({ message: "photo modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};

//fonction de l'admin
exports.deleteOneUser = (req, res, next) => {
  if (req.query.isAdmin) {
    User.destroy({ where: { id: req.query.uid } });
    Publication.destroy({ where: { UserId: req.query.uid } });
    Comment.destroy({ where: { UserId: req.query.uid } })
      .then((res) => {
        res.status(200).json({
          message: "User, publications et commentaires supprimés",
        });
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
    res.status(401).json({ message: " unauthorized " });
  }
};

//fonction utilisateur
exports.deleteMyAccount = (req, res, next) => {
  console.log(" USER ACCOUNT DELETION PROCESS ");
  console.log(" userId is: " + req.params.id);
  Comment.destroy({ where: { UserId: req.params.id } });
  Publication.destroy({ where: { UserId: req.params.id } });
  User.destroy({ where: { id: req.params.id } })
    .then(() => res.status(200).json({ message: "ok" }))
    .catch((error) => console.log(error));
};

exports.logout = (req, res, next) => {
  functions.eraseCookie(res);
};
