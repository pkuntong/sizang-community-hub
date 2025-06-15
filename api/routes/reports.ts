import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Get all reports
router.get('/', async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports' });
  }
});

// Get report by id
router.get('/:id', async (req, res) => {
  try {
    const report = await prisma.report.findUnique({ where: { id: req.params.id } });
    if (!report) return res.status(404).json({ error: 'Report not found' });
    res.json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

// Create report
router.post('/', async (req, res) => {
  try {
    const report = await prisma.report.create({ data: req.body });
    res.status(201).json(report);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create report' });
  }
});

// Update report
router.patch('/:id', async (req, res) => {
  try {
    const report = await prisma.report.update({ where: { id: req.params.id }, data: req.body });
    res.json(report);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update report' });
  }
});

// Delete report
router.delete('/:id', async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete report' });
  }
});

export default router; 