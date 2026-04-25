import prisma from '../config/prisma.js'; // Remember the .js extension for ESM!

export class DogService {
  // READ
  async getAllDogs() {
    return await prisma.dog.findMany({
      orderBy: { breed: 'asc' }
    });
  }

  // CREATE
  async createDog(breed: string, subBreeds: string[] = []) {
    // Check if the breed already exists to prevent duplicate errors
    const existingDog = await prisma.dog.findUnique({ where: { breed } });
    if (existingDog) {
      throw new Error(`Breed '${breed}' already exists.`);
    }

    return await prisma.dog.create({
      data: {
        breed: breed.toLowerCase(),
        subBreeds: subBreeds,
      }
    });
  }

  // UPDATE
  async updateDog(breed: string, subBreeds: string[]) {
    return await prisma.dog.update({
      where: { breed },
      data: { subBreeds }
    });
  }

  // DELETE
  async deleteDog(breed: string) {
    return await prisma.dog.delete({
      where: { breed }
    });
  }
}