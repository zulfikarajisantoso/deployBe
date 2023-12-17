const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const pool = new Pool({
  host: "localhost",
  database: "newBe",
  password: "horus",
  user: "postgres",
  port: 5432, // Default PostgreSQL port
});

// const pool = new Pool({
//   connectionString: process.env.POSTGRES_URL + "?sslmode=require",
// });

const addData = (req, res) => {
  const {
    nik,
    nama_relawan,
    koordinator,
    tandeman,
    notelp,
    no_tps,
    no_kecamatan,
    no_kabupaten,
  } = req.body;

  const query =
    "INSERT INTO data_anggota (nik, nama_relawan, koordinator, tandeman, notelp,   no_tps, no_kecamatan, no_kabupaten) VALUES ($1, $2, $3, $4, $5, $6, $7, $8 ) RETURNING *";
  const values = [
    nik,
    nama_relawan,
    koordinator,
    tandeman,
    notelp,
    no_tps,
    no_kecamatan,
    no_kabupaten,
  ];

  pool.query(query, values, (error, results) => {
    if (error) {
      throw error;
    }
    const data = results.rows[0].id;
    res.status(201).send(`Data added with ID: ${data}`);
  });
};

const getData = async(req, res) => {
  
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM data_anggota');
    const data = result.rows;
    client.release();

    res.json(data);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
};


module.exports = {
  addData,
  getData
};
