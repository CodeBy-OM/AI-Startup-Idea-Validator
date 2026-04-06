import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../db/store.js';
import { analyzeIdea } from '../services/ai.js';

export const ideasRouter = Router();

// POST /ideas — Submit new idea + trigger AI analysis
ideasRouter.post('/', async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ error: 'title and description are required' });
  }
  if (title.length > 200) {
    return res.status(400).json({ error: 'title must be under 200 characters' });
  }
  if (description.length > 2000) {
    return res.status(400).json({ error: 'description must be under 2000 characters' });
  }

  try {
    const report = await analyzeIdea(title, description);

    const idea = {
      id: uuidv4(),
      title,
      description,
      report,
      createdAt: new Date().toISOString(),
    };

    db.insert(idea);

    return res.status(201).json(idea);
  } catch (err) {
    console.error('AI analysis error:', err);
    return res.status(500).json({ error: 'AI analysis failed', message: err.message });
  }
});

// GET /ideas — List all ideas (without full report for brevity)
ideasRouter.get('/', (req, res) => {
  const ideas = db.getAll().map(({ report, ...rest }) => ({
    ...rest,
    profitability_score: report?.profitability_score ?? null,
    risk_level: report?.risk_level ?? null,
    verdict: report?.verdict ?? null,
  }));
  res.json(ideas);
});

// GET /ideas/:id — Full idea with AI report
ideasRouter.get('/:id', (req, res) => {
  const idea = db.getById(req.params.id);
  if (!idea) return res.status(404).json({ error: 'Idea not found' });
  res.json(idea);
});

// DELETE /ideas/:id — Remove an idea
ideasRouter.delete('/:id', (req, res) => {
  const deleted = db.delete(req.params.id);
  if (!deleted) return res.status(404).json({ error: 'Idea not found' });
  res.json({ success: true, id: req.params.id });
});
