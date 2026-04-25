import { Request, Response } from 'express';
import { DogService } from '../services/dog.service.js';

const dogService = new DogService();
const NODE_ENV = process.env.NODE_ENV || 'development';

export class DogController {
  
  // READ
  getDogs = async (req: Request, res: Response) => {
    try {
      const dogs = await dogService.getAllDogs();
      res.status(200).json(dogs);
    } catch (error: any) {
      console.error('Error fetching dogs:', error);
      
      if (NODE_ENV === 'production') {
        res.status(500).json({ error: 'Failed to fetch dogs' });
      } else if (NODE_ENV === 'qa') {
        res.status(500).json({ 
          error: 'Failed to fetch dogs', 
          message: error.message
        });
      } else {
        res.status(500).json({ 
          error: 'Failed to fetch dogs', 
          details: error.message,
          stack: error.stack 
        });
      }
    }
  };

  // CREATE
  createDog = async (req: Request, res: Response) => {
    try {
      const { breed, subBreeds } = req.body;
      
      if (!breed) {
        res.status(400).json({ error: 'Breed is required' });
        return;
      }

      const newDog = await dogService.createDog(breed, subBreeds);
      res.status(201).json(newDog);
    } catch (error: any) {
      console.error('Error creating dog:', error);
      
      if (NODE_ENV === 'production') {
        res.status(400).json({ error: 'Failed to create dog' });
      } else if (NODE_ENV === 'qa') {
        res.status(400).json({ 
          error: error.message || 'Failed to create dog'
        });
      } else {
        res.status(400).json({ 
          error: error.message || 'Failed to create dog',
          stack: error.stack 
        });
      }
    }
  };

  // UPDATE
  updateDog = async (req: Request, res: Response) => {
    try {
      const breed = req.params.breed as string;
      const { subBreeds } = req.body;

      const normalizedSubBreeds = Array.isArray(subBreeds) ? subBreeds : [subBreeds];
      const updatedDog = await dogService.updateDog(breed, normalizedSubBreeds);
      res.status(200).json(updatedDog);
    } catch (error: any) {
      console.error('Error updating dog:', error);
      
      if (NODE_ENV === 'production') {
        res.status(404).json({ error: `Breed '${req.params.breed}' not found` });
      } else if (NODE_ENV === 'qa') {
        res.status(404).json({ 
          error: `Breed '${req.params.breed}' not found`,
          details: error.message
        });
      } else {
        res.status(404).json({ 
          error: `Breed '${req.params.breed}' not found`, 
          details: error.message,
          stack: error.stack
        });
      }
    }
  };

  // DELETE
  deleteDog = async (req: Request, res: Response) => {
    try {
      const breed = req.params.breed as string;
      await dogService.deleteDog(breed);
      
      res.status(200).json({ message: `${breed} successfully deleted` });
    } catch (error: any) {
      console.error('Error deleting dog:', error);
      
      if (NODE_ENV === 'production') {
        res.status(404).json({ error: `Breed '${req.params.breed}' not found` });
      } else if (NODE_ENV === 'qa') {
        res.status(404).json({ 
          error: `Breed '${req.params.breed}' not found`,
          details: error.message
        });
      } else {
        res.status(404).json({ 
          error: `Breed '${req.params.breed}' not found`, 
          details: error.message,
          stack: error.stack
        });
      }
    }
  };
}