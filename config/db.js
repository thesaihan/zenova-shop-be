import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const con = await mongoose.connect(process.env.DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
    });
    console.log(`MongoDB Connected : ${con.connection.host}`.blue.bold);
  } catch (error) {
    console.error(`Error : ${error.message}`.red.bold);
    process.exit(1);
  }
};

export default connectDB;
