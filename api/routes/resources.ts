import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await prisma.resource.findMany();
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// Get resource by id
router.get('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.findUnique({ where: { id: req.params.id } });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json(resource);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resource' });
  }
});

// Create resource
router.post('/', async (req, res) => {
  try {
    const resource = await prisma.resource.create({ data: req.body });
    res.status(201).json(resource);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create resource' });
  }
});

// Update resource
router.patch('/:id', async (req, res) => {
  try {
    const resource = await prisma.resource.update({ where: { id: req.params.id }, data: req.body });
    res.json(resource);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update resource' });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    await prisma.resource.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete resource' });
  }
});

export default router; 