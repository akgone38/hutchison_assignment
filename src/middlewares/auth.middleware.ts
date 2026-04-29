import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request type so we can attach the user ID to it securely
export interface AuthenticatedRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  //extract token using split()
  const authHeader = req.headers.authorization;
  const token= authHeader&&authHeader.split(' ')[1];

  if(!token){
    return res.status(400).json({error:"token issue"});
  }
  //do try catch and set req.user= decoded payload
  try{
      const secret= process.env.JWT_SECRET;
      if(!secret){
        return res.status(500).json({error:"JWT_SECRET not configured"});
      }
      const decodedUser= jwt.verify(token,secret);
      req.user= decodedUser;
      next();
  }
  catch(error){
      return res.status(401).json({error:"Invalid token"});
  }
};