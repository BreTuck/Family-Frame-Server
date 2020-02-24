import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import routes from './routes';
import database from './database';
import 'dotenv/config';

const PORT = 3000;
// const HOSTNAME = '67.176.4.127';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Middleware to return images from the necessary directory 
app.use('/static', express.static(path.join(__dirname, process.env.PATH_TO_IMAGE_DIRECTORY)));

app.use((req, res, next) => {
  req.context = {
    database
  };
  next();
});

app.use('/user', routes.user);
app.use('/image', routes.image);

app.listen(PORT, () =>
  console.log(`Example app listening on port ${PORT}!`),
);