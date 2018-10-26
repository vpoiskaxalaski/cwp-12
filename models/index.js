const Turtle = require('./turtle');
const Weapon = require('./weapon');
const Pizza = require('./pizza');

module.exports = (Sequelize, config) => {
	let sequelize = new Sequelize(config.db, config.login, config.password,
		{
			dialect: config.dialect,
			host: config.host,
			port: config.port,
			options: {
				instanceName: config.dialectOptions.instanceName
			},
			logging: false
		});

	// sequelize = new Sequelize('mssql://cwp_12:cwp_12@ANDREICHAYEUSKI:1433/cwp-12');
	sequelize.authenticate().then(() => {
		console.log('Success initialization');
	}).catch((err) => {
		console.log(`Error connect ${err}`);
	});

	const pizzas = Pizza(Sequelize, sequelize);
	const weapons = Weapon(Sequelize, sequelize);
	const turtles = Turtle(Sequelize, sequelize);
	



	turtles.belongsTo(pizzas, {
		foreignKey: 'firstFavouritePizzaId',
		as: 'firstFavouritePizza'
	});

	turtles.belongsTo(pizzas, {
		foreignKey: 'secondFavouritePizzaId',
		as: 'secondFavouritePizza'
	});

	turtles.belongsTo(weapons, {
		foreignKey: 'weaponId',
		as: 'weapon'
	});

	return {
		turtles,
		weapons,
		pizzas,

		sequelize: sequelize,
		Sequelize: Sequelize,
	};
};