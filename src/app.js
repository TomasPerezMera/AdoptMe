import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

const connectMongoDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión con éxito a MongoDB!');
    } catch (error) {
        console.error('Error al conectar a MongoDB: ', error);
        process.exit(1);
    }
};
connectMongoDB();

app.use(express.json());
app.use(cookieParser());

app.use('/api/users',usersRouter);
app.use('/api/pets',petsRouter);
app.use('/api/adoptions',adoptionsRouter);
app.use('/api/sessions',sessionsRouter);

app.listen(process.env.PORT, () => console.log('Escuchando en Puerto: ' + process.env.PORT));
