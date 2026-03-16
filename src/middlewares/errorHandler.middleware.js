import { CustomError } from '../utils/customErrors.js';
import { logger } from '../utils/logger.js';

/* Middleware global de manejo de errores */

export const errorHandler = (err, req, res, next) => {
    // Si es un CustomError, utilizamos su estructura;
    if (err instanceof CustomError) {
        logger.error(`[${err.code}] ${err.message}`, {
            path: req.path,
            method: req.method,
            code: err.code
        });
        return res.status(err.statusCode).json({
            status: 'error',
            error: err.message,
            code: err.code,
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        });
    }
    // Errores de Mongoose.
    if (err.name === 'ValidationError') {
        logger.error('Mongoose Validation Error', { error: err.message });
        return res.status(400).json({
            status: 'error',
            error: 'Error de validación de datos',
            details: err.message
        });
    }
    if (err.name === 'CastError') {
        logger.error('Mongoose Cast Error', { error: err.message });
        return res.status(400).json({
            status: 'error',
            error: 'ID inválido',
            details: err.message
        });
    }
    // Errores genéricos no manejados;
    logger.error('Unhandled Error', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method
    });
    res.status(500).json({
        status: 'error',
        error: 'Error interno del servidor',
        ...(process.env.NODE_ENV === 'development' && {
            message: err.message,
            stack: err.stack
        })
    });
};

/* Middleware para rutas no encontradas */

export const notFoundHandler = (req, res) => {
    logger.warn(`Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        status: 'error',
        error: `Ruta no encontrada: ${req.method} ${req.path}`
    });
};