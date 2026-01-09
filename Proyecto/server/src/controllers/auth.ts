import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export async function register(req: Request, res: Response) {
  const { email, password, name } = req.body as { email: string; password: string; name?: string };
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'email already in use' });

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ email, password: hash, name });
  await user.save();

  const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });

  res.status(201).json({ token, user: { id: user._id, email: user.email, name: user.name } });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };
  if (!email || !password) return res.status(400).json({ message: 'email and password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ message: 'invalid credentials' });

  const token = jwt.sign({ sub: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: { id: user._id, email: user.email, name: user.name } });
}
