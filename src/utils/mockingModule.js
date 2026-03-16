import { faker } from '@faker-js/faker';
import bcrypt from 'bcrypt';

// Pre-hashear la contraseña "coder123" una sola vez para optimización
const HASHED_PASSWORD = await bcrypt.hash("coder123", 10);

/**
 * Genera una mascota mock con datos aleatorios
 * @returns {Object} Pet object sin owner y con adopted en false
 */
export const generateMockPet = () => {
    return {
        name: faker.animal.petName(),
        specie: faker.helpers.arrayElement(['dog', 'cat', 'bird', 'hamster', 'rabbit']),
        birthDate: faker.date.past({ years: 8 }), // Mascotas de hasta 8 años
        adopted: false,
        owner: null,
        image: faker.image.urlLoremFlickr({ category: 'animals' })
    };
};

/**
 * Genera un array de mascotas mock
 * @param {number} num - Cantidad de mascotas a generar
 * @returns {Array} Array de objetos Pet
 */
export const generateMockPets = (num = 100) => {
    const pets = [];
    for (let i = 0; i < num; i++) {
        pets.push(generateMockPet());
    }
    return pets;
};

/**
 * Genera un usuario mock con datos aleatorios
 * @returns {Object} User object con contraseña hasheada y pets vacío
 */
export const generateMockUser = () => {
    return {
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: faker.internet.email(),
        password: HASHED_PASSWORD, // Todos usan el mismo hash de "coder123"
        role: faker.helpers.arrayElement(['user', 'user', 'user', 'user', 'admin']), // 80% user, 20% admin
        pets: []
    };
};

/**
 * Genera un array de usuarios mock
 * @param {number} num - Cantidad de usuarios a generar
 * @returns {Array} Array de objetos User
 */
export const generateMockUsers = (num = 50) => {
    const users = [];
    for (let i = 0; i < num; i++) {
        users.push(generateMockUser());
    }
    return users;
};
