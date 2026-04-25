import { Router } from 'express';
import { DogController } from '../controllers/dog.controller.js';

const router = Router();
const dogController = new DogController();

// Create (POST)
router.post('/', dogController.createDog);

// Read (GET)
router.get('/', dogController.getDogs);

// Update (PUT or PATCH)
router.put('/:breed', dogController.updateDog);

// Delete (DELETE)
router.delete('/:breed', dogController.deleteDog);

export default router;