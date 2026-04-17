module.exports = {
  up: async ({ context: queryInterface, Sequelize }) => {
    await queryInterface.addColumn("blogs", "year", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.removeColumn("blogs", "year");
  },
};
