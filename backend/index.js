const express = require("express");
const dotevn = require("dotenv");
const cookie = require("cookie-parser");
const morgan = require('morgan')
const cors = require('cors')
const connectDB = require("./lib/db");
const { app, io, server } = require('./lib/socket')
const path = require('path')

dotevn.config();
const port = process.env.PORT;

const Route = require('./routes/index')
const __dirname = path.resolve()

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(morgan('combined'))
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}))
app.use(cookie());
app.use(express.json({ limit: '50mb' }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')))

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'dist', 'index.html'))
  })
}
server.listen(port, () => {
  console.log("Server is success " + port);
  connectDB();
});

Route(app);



