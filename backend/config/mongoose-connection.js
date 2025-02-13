import mongoose from "mongoose";

mongoose
  .connect(process.env.DB_CONNECTION, {
    autoIndex: true,
  })
  .then(() => {
    console.log("Server connected");
  })
  .catch((err) => {
    console.log(err);
  });

export default mongoose.connection;
