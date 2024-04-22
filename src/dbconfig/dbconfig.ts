import mongoose from "mongoose";

export async function connect() {
  try {
    mongoose.connect(process.env.MONGO_URI!);
    const connection = mongoose.connection;
    connection.on("connected", () => {
      console.log("Database Connected Successfully");
    });
    connection.on("error", (err) => {
      console.log(`Error while connecting the database`, err);
      process.exit();
    });
  } catch (error) {
    console.log("something went wrong while connecting the database ");
    console.log(error);
  }
}
