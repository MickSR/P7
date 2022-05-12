const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Publication extends Model {}

  Publication.init(
    {
      publication: {
        type: DataTypes.TEXT,
      },
      publicationUrl: {
        type: DataTypes.STRING,
      },
      UserId: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "Publication",
    }
  );
  return Publication;
};
