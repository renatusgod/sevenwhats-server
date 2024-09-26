module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable('session', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			instance_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			value: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			created_date_time: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				allowNull: false,
			},
			modified_date_time: {
				type: Sequelize.DATE,
				defaultValue: Sequelize.NOW,
				allowNull: false,
			},
		}),
	down: (queryInterface /* , Sequelize */) =>
		queryInterface.dropTable('session'),
};
