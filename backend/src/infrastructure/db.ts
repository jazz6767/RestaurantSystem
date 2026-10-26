import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/RestaurantSystem';

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Export mongoose to keep similarity if needed, though we generally import models directly
export default mongoose;
