module.exports = (sequelize, DataTypes) => {
	const session = sequelize.define(
		'session',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			instance_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			value: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			created_date_time: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
			modified_date_time: {
				type: DataTypes.DATE,
				defaultValue: DataTypes.NOW,
				allowNull: false,
			},
		},
		{
			/**
			 * By default, sequelize will automatically transform all passed model names into plural
			 * References: https://sequelize.org/master/manual/model-basics.html#table-name-inference
			 */
			tableName: 'session',
		}
	);

	session.associate = (models) => {
		session.belongsTo(models.instance, {
			foreignKey: 'instance_id',
			onDelete: 'CASCADE',
		});
	};

	return session;
};
