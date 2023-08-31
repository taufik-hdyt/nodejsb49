"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.bulkInsert("Projects", [
      {
        name: "Test",
        description: "Testing percobaan",
        image: "https://i.imgur.com/1dlelFG.jpg",
        start_date: "2023-07-01",
        end_date: "2023-12-01",
        duration: "2 Bulan",
        react_js: true,
        node_js: false,
        php: true,
        javascript: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("Projects", null, {});
  },
};
