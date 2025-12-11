import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "localhost",
  database: "url-shortener",
  user: "root",
  password: "password123",
});

connection.connect((error) => {
  if (error) {
    console.log("Error connecting to database", error);
  } else {
    console.log("Succesfully conencted to DB");
  }
});

export default connection;
