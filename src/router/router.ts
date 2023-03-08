import { Router } from 'express';
import userRouter from './routes/users';
import profileRouter from './routes/profile';

export const router = Router();
export const securedRouter = Router();

router.use('/users', userRouter);

securedRouter.use('/profile', profileRouter);
