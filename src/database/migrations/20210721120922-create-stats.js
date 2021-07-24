"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Stats", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      url_id: {
        type: Sequelize.STRING,
      },
      ip: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      timezone: {
        type: Sequelize.STRING,
      },
      city: {
        type: Sequelize.STRING,
      },
      device: {
        type: Sequelize.STRING,
      },
      os: {
        type: Sequelize.STRING,
      },
      browser: {
        type: Sequelize.STRING,
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Stats");
  },
};
