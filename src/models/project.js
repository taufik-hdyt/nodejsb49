"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Project.init(
    {
      author: DataTypes.INTEGER,
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      start_date: DataTypes.DATEONLY,
      end_date: DataTypes.DATEONLY,
      duration: DataTypes.STRING,
      image: DataTypes.STRING,
      technologies: DataTypes.JSONB,
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
