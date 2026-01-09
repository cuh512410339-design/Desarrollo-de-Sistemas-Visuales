import { Schema, model } from 'mongoose';

export interface IUser {
  email: string;
  password: string;
  name?: string;
  createdAt?: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  name: { type: String },
  createdAt: { type: Date, default: () => new Date() }
});

export default model<IUser>('User', userSchema);
