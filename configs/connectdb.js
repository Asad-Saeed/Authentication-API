import mongoose from "mongoose";
const connectDB = async (DATABASE_URL) => {
  try {
    const DB_OPTION = {
      dbName: "AuthenticationApi",
    };
    await mongoose.connect(DATABASE_URL, DB_OPTION);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.error("Error", error);
  }
};
export default connectDB;
