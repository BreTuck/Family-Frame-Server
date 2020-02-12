import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import database from './database';

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

app.use('/user', routes.user);
app.use('/image', routes.image);

app.listen(3000, () =>
  console.log('Example app listening on port 3000!'),
);