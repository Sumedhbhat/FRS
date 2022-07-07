const express = require("express");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const path= require("path");
const app = express();
const port = 3007;


app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileupload());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "*",
  })
);
app.use(express.static(path.join(__dirname,"..","client","build")))
const admin = require("./routes/admin");
const user = require("./routes/user")

app.use("/admin", admin);
app.use("/user", user);

app.listen(port, console.log(`Server listening at http://localhost:${port}`));
