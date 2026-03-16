import { Router } from 'express';
import { generateMockPets, generateMockUsers } from '../utils/mockingModule.js';
import { usersService, petsService } from '../services/index.js';

const router = Router();

/**
 * GET /api/mocks/mockingpets
 * Genera 100 mascotas mock y las devuelve como JSON (sin guardar en BD)
 */
router.get('/mockingpets', (req, res) => {
    try {
        const pets = generateMockPets(100);
        res.send({ status: "success", payload: pets });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

/**
 * GET /api/mocks/mockingusers
 * Genera 50 usuarios mock y los devuelve como JSON (sin guardar en BD)
 */
router.get('/mockingusers', (req, res) => {
    try {
        const users = generateMockUsers(50);
        res.send({ status: "success", payload: users });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

/**
 * POST /api/mocks/generateData
 * Genera e inserta en la BD la cantidad especificada de usuarios y mascotas
 * Body: { users: number, pets: number }
 */
router.post('/generateData', async (req, res) => {
    try {
        const { users, pets } = req.body;

        // Validación de parámetros
        if (!users || !pets) {
            return res.status(400).send({ 
                status: "error", 
                error: "Missing parameters. Required: { users: number, pets: number }" 
            });
        }

        if (typeof users !== 'number' || typeof pets !== 'number') {
            return res.status(400).send({ 
                status: "error", 
                error: "Parameters must be numbers" 
            });
        }

        if (users < 0 || pets < 0) {
            return res.status(400).send({ 
                status: "error", 
                error: "Parameters must be positive numbers" 
            });
        }

        // Generar datos mock
        const mockUsers = generateMockUsers(users);
        const mockPets = generateMockPets(pets);

        // Insertar usuarios en BD
        const insertedUsers = [];
        for (const user of mockUsers) {
            const result = await usersService.create(user);
            insertedUsers.push(result);
        }

        // Insertar mascotas en BD
        const insertedPets = [];
        for (const pet of mockPets) {
            const result = await petsService.create(pet);
            insertedPets.push(result);
        }

        res.send({ 
            status: "success", 
            message: "Data generated and inserted successfully",
            payload: {
                usersInserted: insertedUsers.length,
                petsInserted: insertedPets.length
            }
        });

    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});

export default router;
