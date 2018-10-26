const Sequelize = require('sequelize');

const config = require('./config.json');

const db = require('./models')(Sequelize, config);
const Op = Sequelize.Op;

(async () => {
	await db.sequelize.sync({force: true});
	await require('./initTables/pizzas')(db);
	await require('./initTables/weapons')(db);
	await require('./initTables/turtles')(db);

	console.log("\nGET TURTLES");
	(await db.turtles.findAll()).forEach((v) => {
		console.log(v.name);
	});


	console.log('\nFavourite pizza is Mozzarella');
	(await db.turtles.findAll({
		where: {
			'$firstFavouritePizza.name$': 'mozzarella'
		},
		include: [{
			model: db.pizzas,
			as: 'firstFavouritePizza'
		}]
	})).forEach((v) => {
		console.log(v.name);
	});


	console.log('\nUnique favourite pizzas');
	(await db.turtles.findAll({
		include: [{
			model: db.pizzas,
			as: 'firstFavouritePizza'
		}]
	})).forEach((v) => {
		let obj = v.dataValues.firstFavouritePizza.dataValues;
		console.log(`for ${v.dataValues.name} => id = ${obj.id}, name = ${obj.name}`);
	});


	console.log('\nCreate new turtles');
	await db.turtles.create({
		name: 'Alena',
		color: 'red',
		weaponId: 2,
		firstFavouritePizzaId: 1,
		secondFavouritePizzaId: 3
	}).then(function(row) {
		console.log(row.dataValues);
	});


	console.log('\nUpdate if calories > 3000 { add "SUPER FAT!" }');
	await db.pizzas.update(
		{
			description : 'SUPER FAT!'
		},
		{
			where: {
				calories: {
					[Op.gt]: 3000
				}
			}
		}
	).then(function(row) {
		console.log(`${row} items update!`);
	});


	console.log('\nGet count if dps > 100');
	console.log(`Count = ${(await db.weapons.findAll(
		{
			where: {
				dps: {
					[Op.gt]: 100
				}
			}
		})).length}`);


	console.log('\nGet pizza with id = 1');
	(await db.pizzas.findAll({
		where: {
			id: 1
		}
	})).forEach((val) => {
		console.log(`Name = ${val.name}`);
	});


	console.log('\nAdd pizza for turtle');
	(await db.turtles.update(
		{
			firstFavouritePizzaId: 2
		},
		{
			where: {
				id: 5
			}
		}
	)).forEach(() => {
		console.log(`Updated!`);
	});

	console.log('\nEnd program');
})();