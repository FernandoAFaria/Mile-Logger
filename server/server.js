const express = require("express");
const path = require("path");
const app = express();
const db = require("./routes/dbActions");
const forgotPW = require('./routes/forgot');
// const cors = require('cors');

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "../public")));
// app.use(cors());
// app.options("*", cors());
app.use("/users", db.router);
app.use("/forgot", forgotPW);

const port = process.env.PORT || 8137;

app.listen(port, () => console.log(`listening on port ${port}`));
