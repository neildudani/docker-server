const express = require('express');
const app = express();
const port = 4444;

const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  host: 'db',
  database: 'some-postgres',
  password: 'mysecretpassword',
  port: 5432,
})


async function ConnectToDb() {
  let retries = 5;
  while (retries) {
    try {
      await client.connect();
      break;
    } catch (err) {
      console.log('error: ', err);
      retries -= 1;
      console.log(`retries left: ${retries}`);
      await new Promise(res => setTimeout(res, 5000));
    }
  }
}

ConnectToDb()


app.get('/', (req, res) => {
  client.query('SELECT * FROM team', (err, dbResponse) => {
    if (err) {
      res.status(400);
      console.log(err);
      res.send('Database is not connected successfully!');
    }
    console.log('db response: ', dbResponse);
    res.send(dbResponse);
  });
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))