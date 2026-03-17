import 'dotenv/config';
import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';

import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import loggerTestRouter from './routes/loggerTest.router.js';

import { logger, logRequest } from './utils/logger.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.middleware.js';


const app = express();


/* Variables de Entorno */
const PORT = process.env.PORT || 8080;
const connectMongoDB = async () => {
    mongoose.connect(process.env.MONGO_URI)
    .then(() => logger.info('Conexión con éxito a MongoDB!'))
    .catch(err => {
        logger.fatal('Error al conectar a MongoDB: ', err);
        process.exit(1);
    });
};
connectMongoDB();


/* Middlewares */
app.use(express.json());
app.use(cookieParser());
app.use(logRequest);


/* Routers */
app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/api/loggerTest', loggerTestRouter);


/* Health Check Endpoint para Docker */
app.get('/health', (req, res) => {
    res.status(200).send({ status: 'OK', message: 'Server is running' });
});


/* Manejo de rutas no encontradas */
app.use(notFoundHandler);


/* Manejo global de errores */
app.use(errorHandler);


/* Inicializamos Servidor */
app.listen(PORT, () => {
    logger.info(`Escuchando en Puerto: ${PORT}`);
    logger.info(`Entorno: ${process.env.NODE_ENV || 'Desarrollo'}`);
    logger.info(`Nivel de Logger: ${process.env.NODE_ENV === 'production' ? 'info+' : 'debug+'}`);
});


/* Endpoint con información general del proyecto */
app.get('/', (req, res) => {
    res.send({
        project: 'AdoptMe API',
        version: '2.0.0',
        endpoints: ['/api/users', '/api/pets', '/api/adoptions', '/api/sessions', '/api/mocks'],
        docs: '/health'
    });
});