const mysql = require("mysql2");
const cTable = require("console.table");
require("dotenv").config();

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DB_PASSWORD,
  database: "employee_db",
});

connection.connect((err) => {
  if (err) throw err;
  welcomeSpeech();
});

module.exports = connection;
