/* Diccionario de Errores Custom */

export const ErrorCodes = {
    // Errores de Usuario (1xxx)
    USER_NOT_FOUND: 1001,
    USER_ALREADY_EXISTS: 1002,
    USER_INVALID_CREDENTIALS: 1003,
    USER_INCOMPLETE_VALUES: 1004,

    // Errores de Mascota (2xxx)
    PET_NOT_FOUND: 2001,
    PET_ALREADY_ADOPTED: 2002,
    PET_INCOMPLETE_VALUES: 2003,

    // Errores de Adopción (3xxx)
    ADOPTION_NOT_FOUND: 3001,
    ADOPTION_INVALID_USER: 3002,
    ADOPTION_INVALID_PET: 3003,

    // Errores de Autenticación (4xxx)
    AUTH_MISSING_TOKEN: 4001,
    AUTH_INVALID_TOKEN: 4002,
    AUTH_UNAUTHORIZED: 4003,

    // Errores de Base de Datos (5xxx)
    DATABASE_ERROR: 5001,
    DATABASE_VALIDATION_ERROR: 5002,

    // Errores Generales (9xxx)
    INTERNAL_SERVER_ERROR: 9001,
    INVALID_PARAMS: 9002,
    ROUTE_NOT_FOUND: 9003
};

/* Mensajes de error asociados a cada código */

export const ErrorMessages = {
    [ErrorCodes.USER_NOT_FOUND]: "Usuario no encontrado.",
    [ErrorCodes.USER_ALREADY_EXISTS]: "El usuario ya existe!",
    [ErrorCodes.USER_INVALID_CREDENTIALS]: "Credenciales inválidas!",
    [ErrorCodes.USER_INCOMPLETE_VALUES]: "Datos de usuario incompletos.",

    [ErrorCodes.PET_NOT_FOUND]: "Mascota no encontrada.",
    [ErrorCodes.PET_ALREADY_ADOPTED]: "La mascota ya ha sido adoptada!",
    [ErrorCodes.PET_INCOMPLETE_VALUES]: "Datos de mascota incompletos.",

    [ErrorCodes.ADOPTION_NOT_FOUND]: "Adopción no encontrada.",
    [ErrorCodes.ADOPTION_INVALID_USER]: "Usuario inválido para adopción!",
    [ErrorCodes.ADOPTION_INVALID_PET]: "Mascota inválida para adopción!",

    [ErrorCodes.AUTH_MISSING_TOKEN]: "Token de autenticación faltante.",
    [ErrorCodes.AUTH_INVALID_TOKEN]: "Token de autenticación inválido.",
    [ErrorCodes.AUTH_UNAUTHORIZED]: "No Autorizado!",

    [ErrorCodes.DATABASE_ERROR]: "Error de base de datos.",
    [ErrorCodes.DATABASE_VALIDATION_ERROR]: "Error de validación de datos.",

    [ErrorCodes.INTERNAL_SERVER_ERROR]: "Error interno del servidor.",
    [ErrorCodes.INVALID_PARAMS]: "Parámetros inválidos.",
    [ErrorCodes.ROUTE_NOT_FOUND]: "Ruta no encontrada!"
};

/* Clase de Error Personalizado */

export class CustomError extends Error {
    constructor(code, message = null, statusCode = 500) {
        super(message || ErrorMessages[code]);
        this.code = code;
        this.statusCode = statusCode;
        this.name = 'CustomError';
        Error.captureStackTrace(this, this.constructor);
    }
}

/* Factory de errores comunes */

export const ErrorFactory = {
    // Errores de Usuario
    userNotFound: () => new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        ErrorMessages[ErrorCodes.USER_NOT_FOUND],
        404
    ),
    userAlreadyExists: (email = null) => new CustomError(
        ErrorCodes.USER_ALREADY_EXISTS,
        email ? `El usuario con email ${email} ya existe!` : ErrorMessages[ErrorCodes.USER_ALREADY_EXISTS],
        400
    ),
    userIncompleteValues: (missingFields = []) => new CustomError(
        ErrorCodes.USER_INCOMPLETE_VALUES,
        missingFields.length > 0
            ? `Campos faltantes: ${missingFields.join(', ')}`
            : ErrorMessages[ErrorCodes.USER_INCOMPLETE_VALUES],
        400
    ),
    invalidCredentials: () => new CustomError(
        ErrorCodes.USER_INVALID_CREDENTIALS,
        ErrorMessages[ErrorCodes.USER_INVALID_CREDENTIALS],
        401
    ),
    petNotFound: () => new CustomError(
        ErrorCodes.PET_NOT_FOUND,
        ErrorMessages[ErrorCodes.PET_NOT_FOUND],
        404
    ),
    petAlreadyAdopted: () => new CustomError(
        ErrorCodes.PET_ALREADY_ADOPTED,
        ErrorMessages[ErrorCodes.PET_ALREADY_ADOPTED],
        400
    ),
    petIncompleteValues: (missingFields = []) => new CustomError(
        ErrorCodes.PET_INCOMPLETE_VALUES,
        missingFields.length > 0
            ? `Campos faltantes: ${missingFields.join(', ')}`
            : ErrorMessages[ErrorCodes.PET_INCOMPLETE_VALUES],
        400
    ),
    adoptionNotFound: () => new CustomError(
        ErrorCodes.ADOPTION_NOT_FOUND,
        ErrorMessages[ErrorCodes.ADOPTION_NOT_FOUND],
        404
    ),
    databaseError: (details = null) => new CustomError(
        ErrorCodes.DATABASE_ERROR,
        details || ErrorMessages[ErrorCodes.DATABASE_ERROR],
        500
    ),
    invalidParams: (details = null) => new CustomError(
        ErrorCodes.INVALID_PARAMS,
        details || ErrorMessages[ErrorCodes.INVALID_PARAMS],
        400
    )
};