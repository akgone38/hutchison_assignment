import { Router } from 'express';
import { DogController } from '../controllers/dog.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js'; // Import the guard

const router = Router();
const dogController = new DogController();

// We inject requireAuth as the second parameter to protect these routes
router.post('/', requireAuth, dogController.createDog);
router.get('/', requireAuth, dogController.getDogs);
router.put('/:breed', requireAuth, dogController.updateDog);
router.delete('/:breed', requireAuth, dogController.deleteDog);

export default router;