import dotenv from 'dotenv';

dotenv.config();

export const PORT = parseInt(process.env.PORT as string, 10);
