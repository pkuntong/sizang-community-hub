import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all forum threads
router.get('/', async (req, res) => {
  try {
    const threads = await prisma.forumThread.findMany();
    res.json(threads);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch threads' });
  }
});

// Get thread by id
router.get('/:id', async (req, res) => {
  try {
    const thread = await prisma.forumThread.findUnique({ where: { id: req.params.id } });
    if (!thread) return res.status(404).json({ error: 'Thread not found' });
    res.json(thread);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch thread' });
  }
});

// Create thread
router.post('/', async (req, res) => {
  try {
    const thread = await prisma.forumThread.create({ data: req.body });
    res.status(201).json(thread);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create thread' });
  }
});

// Update thread
router.patch('/:id', async (req, res) => {
  try {
    const thread = await prisma.forumThread.update({ where: { id: req.params.id }, data: req.body });
    res.json(thread);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update thread' });
  }
});

// Delete thread
router.delete('/:id', async (req, res) => {
  try {
    await prisma.forumThread.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete thread' });
  }
});

export default router; 