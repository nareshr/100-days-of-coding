import { verify } from '../utils/jwt.js';
import prisma from '../prismaClient.js';

async function requireAuth(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'Missing Authorization' });
    const [, token] = auth.split(' ');
    const payload = verify(token);
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, include: { role: true } });
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }
}

export { requireAuth };
