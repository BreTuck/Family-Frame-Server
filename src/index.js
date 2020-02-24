import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import database from './database';

const PORT = 3000;
// const HOSTNAME = '67.176.4.127';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use((req, res, next) => {
  req.context = {
    database
  };
  next();
});

app.get('/', (req, res) => {
  res.send("Hello World!");
});
app.use('/user', routes.user);
app.use('/image', routes.image);

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);