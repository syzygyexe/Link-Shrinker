const express = require("express");
const config = require("config");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// middleware to convert req.body into JSON format
// Because initially, node.js does not take req.body in JSON format.
app.use(express.json({ extended: true }));

// registring APIs for our front-end with needed middleware.
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/link", require("./routes/link.routes"));
app.use("/t", require("./routes/redirect.routes"));

if (process.env.NODE_ENV === "production") {
  app.use("/", express.static(path.join(__dirname, "client", "build")));

  // On any get request we are going to send ./client/build/index.html
  // By doing so we will run backend and frontend simultaneously
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

// If port is not defined inside of our ./config/default.json file, we set it to 5000.
const PORT = config.get("port") || 5000;

async function start() {
  try {
    // Connect to DB, "mongoUri" is taken from the ./config/default.json
    await mongoose.connect(config.get("mongoUri"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    // Start server after DB is connected
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}`));
  } catch (e) {
    console.log("Server Error", e.message);
    // Terminate process if any malfunction occurs.
    process.exit(1);
  }
}

start();
