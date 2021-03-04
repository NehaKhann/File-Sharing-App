const express = require("express");

const app = express();

const path = require("path")


const PORT = process.env.PORT || 3000;
require("dotenv").config();

const cors = require('cors');
// Cors 
const corsOptions = {
  origin:process.env.ALLOWED_CLIENTS.split(',')
  // ['http://localhost:3000', 'http://localhost:5000', 'http://localhost:3300']
}
app.use(cors(corsOptions))
app.use(express.static("public"))
app.use(express.json());//else req.body main undefined aiga better write it to get the data

require("./config/db");



//template engine
app.set("views",path.join(__dirname,"/views"))
app.set("view engine","ejs")
//Routes
app.use("/api/files", require("./routes/files"));
app.use("/files",require("./routes/show"))
app.use("/files/download",require("./routes/download"))
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
