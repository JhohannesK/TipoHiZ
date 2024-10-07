import mongoose from 'mongoose';

const connectDB = async () => {
   try {
      await mongoose.connect(process.env.MONGO_URI!);
      console.log('Connected to Database!');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
   } catch (error: any) {
      console.error(error.message);
      process.exit(1);
   }
};

export default connectDB;
