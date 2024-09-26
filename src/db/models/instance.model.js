module.exports = (sequelize, DataTypes) => {
	const instance = sequelize.define(
		'instance',
		{
			id: {
				type: DataTypes.INTEGER,
				allowNull: false,
				primaryKey: true,
				autoIncrement: true,
			},
			user_id: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
			session: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			web_hook: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			events: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			qr_code: {
				type: DataTypes.TEXT,
				allowNull: true,
			},
			status: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			is_multi_device: {
				type: DataTypes.BOOLEAN,
				allowNull: true,
			},
			retries: {
				type: DataTypes.INTEGER,
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
			tableName: 'instance',
		}
	);

	instance.associate = (models) => {
		instance.hasMany(models.session, {
			foreignKey: 'id',
			onDelete: 'CASCADE',
		});
	};

	instance.associate = (models) => {
		instance.belongsTo(models.user, {
			foreignKey: 'user_id',
			onDelete: 'CASCADE',
		});
	};

	return instance;
};
