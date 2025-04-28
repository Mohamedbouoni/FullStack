const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const User = require("./models/userSchema");
const path=require("path")
const employeeRoutes  = require("./routes/routeEmployees");
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json());
mongoose.connect("mongodb+srv://linkous:pyezA6rVCfMgysOZ@cluster0.pxssh1m.mongodb.net/Project?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));




// Routes
app.use('/api/user', require('./routes/route'));
app.use('/api/employees', employeeRoutes);
app.use('/api',require('./routes/roleStatsRoute'))
app.use('/api', require('./routes/jobs'));


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
