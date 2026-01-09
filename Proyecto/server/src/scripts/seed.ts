import dotenv from 'dotenv';
import { connectDB } from '../config/db';
import User from '../models/User';
import bcrypt from 'bcryptjs';

dotenv.config();

async function seed() {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
  const password = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  const name = process.env.SEED_ADMIN_NAME || 'Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = new User({ email, password: hash, name });
  await user.save();
  console.log('Seeded admin user:', email);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});