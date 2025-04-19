const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const studentSignupRoute = require('./routes/auth/student/signup'); 
const studentSigninRoute = require('./routes/auth/student/signin'); 
const creatorSignupRoute = require('./routes/auth/Creator/signup'); 
const moment = require("moment");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const mongoUrl = process.env.MONGO_URL; 

mongoose.connect(mongoUrl).then(() => {
    console.log("MongoDB successfully connected");
}).catch((e) => {
    console.error("Failed to connect to MongoDB", e);
});

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use('/api/students/signup', studentSignupRoute);
app.use('/api/students/signin', studentSigninRoute);
app.use('/api/creators/signup', creatorSignupRoute);

app.listen(5001, () => {
    console.log('Server is running on port 5001');
});
