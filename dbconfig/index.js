const Sequelize = require('sequelize');

const sequelize = new Sequelize('hapi_tutorial', 'postgres', 'postgres', {
    host: 'localhost',
    port: 5432,
    dialect: 'postgres',
});

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const [results] = await sequelize.query('SELECT * FROM users');
        console.log(results);
    } catch (error) {
        console.log('Unable to connect to the database:');
    }
}


testConnection();
