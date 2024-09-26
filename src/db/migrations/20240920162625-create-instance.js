module.exports = {
	up: async (queryInterface, Sequelize) =>
		queryInterface.createTable('instance', {
			id: {
				type: Sequelize.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: Sequelize.INTEGER,
				allowNull: false,
			},
			session: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			web_hook: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			events: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			qr_code: {
				type: Sequelize.TEXT,
				allowNull: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			is_multi_device: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
			},
			status: {
				type: Sequelize.STRING,
				allowNull: true,
			},
			retries: {
				type: Sequelize.INTEGER,
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
		queryInterface.dropTable('instance'),
};
