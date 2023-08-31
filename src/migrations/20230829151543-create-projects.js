"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Projects", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.STRING,
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      duration: {
        type: Sequelize.STRING,
      },
      node_js: {
        type: Sequelize.BOOLEAN,
      },
      react_js: {
        type: Sequelize.BOOLEAN,
      },
      php: {
        type: Sequelize.BOOLEAN,
      },
      javascript: {
        type: Sequelize.BOOLEAN,
      },
      image: {
        type: Sequelize.STRING,
      },
      technologies: {
        type: Sequelize.JSON,
        defaultValue: {
          node_js: false,
          react_js: false,
          php: false,
          javascript: false,
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Projects");
  },
};
