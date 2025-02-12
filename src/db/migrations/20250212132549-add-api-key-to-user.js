'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	up: async (queryInterface, Sequelize) => {
		await queryInterface.addColumn('user', 'api_key', {
			type: Sequelize.STRING,
			allowNull: true, // Defina como `false` se a API Key for obrigatória
			unique: true, // Define como única, se necessário
		});
	},

	down: async (queryInterface) => {
		await queryInterface.removeColumn('user', 'api_key');
	},
};
