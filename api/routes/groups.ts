import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all groups
router.get('/', async (req, res) => {
  try {
    const groups = await prisma.group.findMany();
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

// Get group by id
router.get('/:id', async (req, res) => {
  try {
    const group = await prisma.group.findUnique({ where: { id: req.params.id } });
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

// Create group
router.post('/', async (req, res) => {
  try {
    const group = await prisma.group.create({ data: req.body });
    res.status(201).json(group);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create group' });
  }
});

// Update group
router.patch('/:id', async (req, res) => {
  try {
    const group = await prisma.group.update({ where: { id: req.params.id }, data: req.body });
    res.json(group);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update group' });
  }
});

// Delete group
router.delete('/:id', async (req, res) => {
  try {
    await prisma.group.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete group' });
  }
});

export default router; 