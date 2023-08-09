require('dotenv').config();
const express = require('express');
const connectDB = require('./utils/db');
const adminRoutes = require('./routes/admin');
const studentRoutes = require('./routes/student');

const app = express();

connectDB();

// configuration
// i want to accept form data and json data
app.use(express.urlencoded({extended:true}));
// app.use(express.json());


// routes
app.use('/api/admin',adminRoutes);
app.use('/api/student',studentRoutes);

let PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})