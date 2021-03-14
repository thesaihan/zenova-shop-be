import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected : ${con.connection.host}`);
  } catch (error) {
    console.error(`Error : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
