const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const { Client } = require('pg');

const app = express();

const db = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: +process.env.PGPORT,
});
db.connect();

function absCorrelationCoefficients(data) {
  const newData = [];
  data.forEach((row) => {
    const newRow = {...row};
    Object.entries(row).forEach(([key, val], i) => {
      if (key.match(/r\d+/) && val < 0) {
        newRow[key] = Math.abs(val);
      }
    });
    newData.push(newRow);
  });
  return newData;
}

app.get('/api/candles', (req, res, next) => {
  db.query(`
    SELECT * 
      FROM candles 
      ORDER BY "createdAt" ASC
  `, (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).json(typeof error === 'object' ? error : {error});
    }
    console.log(data.rows.length + ' rows retrieved');
    const ret = absCorrelationCoefficients(data.rows);
    res.status(200).json(ret);
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Server running on port', process.env.PORT));

