import 'dotenv/config';
import user from './user';
import image from './image';
import { Pool } from 'pg';

const dbConfigObj = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
}

const pool = new Pool(dbConfigObj);

export default {
    pool,
    user,
    image
}
