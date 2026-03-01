import { connectDB } from '../config/db';
import mongoose from 'mongoose';

beforeAll(async () => {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/everblue-test';
  await connectDB(MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});
