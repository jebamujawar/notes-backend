require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoutes = require("./routes/auth");
const noteRoutes = require("./routes/notes");

const app = express();

//Middleware
app.use(cors()); 
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err)); 

  //Routes
app.use("/api/auth",authRoutes );
app.use("/api/notes",noteRoutes );

//Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
