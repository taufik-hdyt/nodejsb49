"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Projects extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Projects.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      start_date: DataTypes.DATE,
      end_date: DataTypes.DATE,
      duration: DataTypes.STRING,
      node_js: DataTypes.BOOLEAN,
      react_js: DataTypes.BOOLEAN,
      php: DataTypes.BOOLEAN,
      javascript: DataTypes.BOOLEAN,
      image: DataTypes.STRING,
      technologies: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "Projects",
    }
  );
  return Projects;
};
