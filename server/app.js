const express = require("express");
const fileupload = require("express-fileupload");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileupload());
app.use(
  cors({
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    origin: "*",
  })
);
const admin = require("./routes/admin");
const user = require("./routes/user");
app.use("/api/admin",admin);
app.use("/api/user", user);

//app.use('/api/frs',express.static(path.join(__dirname, "..", "client", "build")));

app.get("/", (req, res) => {
	res.send('OKOKOK')
//	 res.sendFile(path.resolve(__dirname, "..", "client", "build", "index.html"));
});

app.listen(port,'0.0.0.0', console.log(`Server listening at http://localhost:${port}`));
