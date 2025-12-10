import dotenv from 'dotenv';
import app from './src/app';
import connectDB from './src/config/database';
dotenv.config();

const PORT = process.env.PORT || 5000;
connectDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
