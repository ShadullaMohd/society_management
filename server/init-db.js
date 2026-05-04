require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // Connect to default 'postgres' db to create new db
  password: process.env.DB_PASS,
  port: process.env.DB_PORT || 5432,
});

const init = async () => {
  try {
    await client.connect();
    console.log('Connected to postgres database...');
    
    // Check if society_management exists
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${process.env.DB_NAME}'`);
    if (res.rowCount === 0) {
        console.log(`Creating database ${process.env.DB_NAME}...`);
        await client.query(`CREATE DATABASE "${process.env.DB_NAME}"`);
        console.log('Database created successfully!');
    } else {
        console.log(`Database ${process.env.DB_NAME} already exists.`);
    }
    
    await client.end();
    process.exit(0);
  } catch (err) {
    console.error('Initialization failed:', err);
    process.exit(1);
  }
};

init();
