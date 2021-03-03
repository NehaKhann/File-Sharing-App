
require("dotenv").config()
const mongoose = require("mongoose");

  //database connection

  mongoose
    .connect(process.env.MONGO_CONN_URL, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: true,
    })
    .then(() => {
      console.log("Database connected");
    })
    .catch((error) => {
      console.log(error);
    });

