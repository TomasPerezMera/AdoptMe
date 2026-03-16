import { Router } from 'express';
import { logger } from '../utils/logger.js';

const router = Router();

/* GET /api/loggerTest - Prueba todos los niveles de logging */

router.get('/', (req, res) => {
    // Probar cada nivel de log;
    logger.debug('Éste es un mensaje de DEBUG - sólo se verá en desarrollo.');
    logger.http('Éste es un mensaje de HTTP - para logs de requests.');
    logger.info('Éste es un mensaje de INFO - información general.');
    logger.warning('Éste es un mensaje de WARNING - advertencias.');
    logger.error('Éste es un mensaje de ERROR - errores manejados.');
    logger.fatal('Éste es un mensaje de FATAL - errores críticos.');

    // Log con metadata adicional;
    logger.info('Log con metadata', {
        user: 'test-user',
        action: 'logger-test',
        timestamp: new Date().toISOString()
    });

    res.send({
        status: 'success',
        message: 'Logger Test completado!',
        levels: {
            debug: 'Sólo desarrollo - nivel más bajo',
            http: 'Requests HTTP',
            info: 'Información general',
            warning: 'Advertencias',
            error: 'Errores (se guardan en errors.log)',
            fatal: 'Errores críticos!'
        },
        environment: process.env.NODE_ENV || 'development',
        logsFrom: process.env.NODE_ENV === 'production' ? 'info' : 'debug'
    });
});

export default router;