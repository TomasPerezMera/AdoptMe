import winston from 'winston';

/* Niveles personalizados de logging */

const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red bold',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
};

// Aplicamos los colores a winston;
winston.addColors(customLevels.colors);

/* Formato común para todos los logs */

const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
        let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
        // Agregamos metadata si existe;
        if (Object.keys(meta).length > 0) {
            log += ` ${JSON.stringify(meta)}`;
        }
        // Agregamos stack trace si existe;
        if (stack) {
            log += `\n${stack}`;
        }
        return log;
    })
);

/* Logger para Desarrollo */

const developmentLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'debug',
    format: winston.format.combine(
        winston.format.colorize(),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

/* Logger para Producción */

const productionLogger = winston.createLogger({
    levels: customLevels.levels,
    level: 'info',
    format: logFormat,
    transports: [
        // Consola: info y superiores;
        new winston.transports.Console({
            level: 'info'
        }),
        // Archivo: solo errores y fatales;
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error'
        })
    ]
});


/* Exportar logger según el entorno */

export const logger = process.env.NODE_ENV === 'production'
    ? productionLogger
    : developmentLogger;

/* Helper para loggear requests HTTP */

export const logRequest = (req, res, next) => {
    logger.http(`${req.method} ${req.path}`, {
        ip: req.ip,
        userAgent: req.get('user-agent')
    });
    next();
};