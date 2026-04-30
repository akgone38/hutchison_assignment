import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export class AuthService {
  async register(email: string, passwordPlain: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash the password with a salt factor of 10
    const hashedPassword = await bcrypt.hash(passwordPlain, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return { id: user.id, email: user.email };
  }

  async login(email: string, passwordPlain: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Compare the provided password with the hashed password in the DB
    const isValidPassword = await bcrypt.compare(passwordPlain, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate a JWT valid for 24 hours
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' }
    );

    return { token, user: { id: user.id, email: user.email } };
  }
}