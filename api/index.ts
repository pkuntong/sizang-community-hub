import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import usersRouter from './routes/users';
import forumThreadsRouter from './routes/forumThreads';
import groupsRouter from './routes/groups';
import resourcesRouter from './routes/resources';
import reportsRouter from './routes/reports';

// Load environment variables
dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Sizang Community Hub API is running');
});

app.use('/api/users', usersRouter);
app.use('/api/forum-threads', forumThreadsRouter);
app.use('/api/groups', groupsRouter);
app.use('/api/resources', resourcesRouter);
app.use('/api/reports', reportsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server listening on port ${PORT}`);
}); 