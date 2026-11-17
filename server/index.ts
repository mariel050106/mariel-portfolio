import 'dotenv/config';
import express, { type Request, type Response } from 'express';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prisma } from './prisma';

const app = express();
const PORT = Number(process.env.PORT || 5000);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json({ limit: '1mb' }));

const router = express.Router();

function cleanText(value: unknown, maxLength = 160): string | null {
  if (typeof value !== 'string') return null;
  const cleaned = value.trim();
  if (!cleaned) return null;
  return cleaned.slice(0, maxLength);
}

function parseViews(value: unknown): number | null {
  if (value === undefined || value === null || value === '') return 0;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed < 0) return null;
  return parsed;
}

function parseOptionalUrl(value: unknown): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === '') return null;
  if (typeof value !== 'string') return undefined;
  const candidate = value.trim();
  if (!candidate) return null;
  try {
    const parsed = new URL(candidate);
    if (!['http:', 'https:'].includes(parsed.protocol)) return undefined;
    return candidate.slice(0, 500);
  } catch {
    return undefined;
  }
}

function validChoice(value: unknown, choices: string[], fallback: string): string | null {
  if (value === undefined || value === null || value === '') return fallback;
  if (typeof value !== 'string' || !choices.includes(value)) return null;
  return value;
}

router.get('/health', async (_req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(503).json({ status: 'error', database: 'disconnected' });
  }
});

// READ: return all saved creator content records.
router.get('/content', async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.creatorPost.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json(posts);
  } catch (error) {
    console.error('Could not retrieve creator posts:', error);
    res.status(500).json({ error: 'Could not load content records.' });
  }
});

// CREATE: validate form data and insert a record through Prisma Client.
router.post('/content', async (req: Request, res: Response) => {
  const title = cleanText(req.body?.title, 100);
  const platform = validChoice(req.body?.platform, ['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Other'], 'TikTok');
  const contentType = validChoice(req.body?.contentType, ['Short video', 'Shop affiliate video', 'Lifestyle video', 'Product showcase', 'Photo post', 'Live stream', 'Other'], 'Short video');
  const status = validChoice(req.body?.status, ['Draft', 'Scheduled', 'Published'], 'Draft');
  const views = parseViews(req.body?.views);
  const link = parseOptionalUrl(req.body?.link);
  const description = cleanText(req.body?.description, 500);

  if (!title) return res.status(400).json({ error: 'A content title is required (maximum 100 characters).' });
  if (!platform || !contentType || !status) return res.status(400).json({ error: 'Choose a valid platform, content type, and status.' });
  if (views === null) return res.status(400).json({ error: 'Views must be a whole number of zero or more.' });
  if (link === undefined) return res.status(400).json({ error: 'The link must be a valid http or https URL.' });

  try {
    const created = await prisma.creatorPost.create({
      data: { title, platform, contentType, status, views, link, description },
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Could not create creator post:', error);
    res.status(500).json({ error: 'Could not save this content record.' });
  }
});

// UPDATE: edit an existing record using its database ID.
router.put('/content/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid content ID.' });

  const title = cleanText(req.body?.title, 100);
  const platform = validChoice(req.body?.platform, ['TikTok', 'Instagram', 'Facebook', 'YouTube', 'Other'], 'TikTok');
  const contentType = validChoice(req.body?.contentType, ['Short video', 'Shop affiliate video', 'Lifestyle video', 'Product showcase', 'Photo post', 'Live stream', 'Other'], 'Short video');
  const status = validChoice(req.body?.status, ['Draft', 'Scheduled', 'Published'], 'Draft');
  const views = parseViews(req.body?.views);
  const link = parseOptionalUrl(req.body?.link);
  const description = cleanText(req.body?.description, 500);

  if (!title) return res.status(400).json({ error: 'A content title is required (maximum 100 characters).' });
  if (!platform || !contentType || !status) return res.status(400).json({ error: 'Choose a valid platform, content type, and status.' });
  if (views === null) return res.status(400).json({ error: 'Views must be a whole number of zero or more.' });
  if (link === undefined) return res.status(400).json({ error: 'The link must be a valid http or https URL.' });

  try {
    const updated = await prisma.creatorPost.update({
      where: { id },
      data: { title, platform, contentType, status, views, link, description },
    });
    res.json(updated);
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'This content record no longer exists.' });
    }
    console.error('Could not update creator post:', error);
    res.status(500).json({ error: 'Could not update this content record.' });
  }
});

// DELETE: permanently remove a record from SQLite through Prisma Client.
router.delete('/content/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) return res.status(400).json({ error: 'Invalid content ID.' });

  try {
    await prisma.creatorPost.delete({ where: { id } });
    res.status(204).send();
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2025') {
      return res.status(404).json({ error: 'This content record no longer exists.' });
    }
    console.error('Could not delete creator post:', error);
    res.status(500).json({ error: 'Could not delete this content record.' });
  }
});

app.use('/api', router);

// In production, serve the React build from the same Express process.
const clientDist = path.resolve(__dirname, '../dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(clientDist, 'index.html')));
}

const server = app.listen(PORT, () => {
  console.log(`Mariel Creatives API is running at http://localhost:${PORT}`);
});

async function shutdown() {
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
