const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const studentSignupRoute = require('./routes/auth/student/signup'); 
const studentSigninRoute = require('./routes/auth/student/signin'); 
const creatorSignupRoute = require('./routes/auth/Creator/signup'); 
const creatorSigninRoute = require('./routes/auth/Creator/signin'); 
const studentMeRoute = require('./routes/auth/student/auth'); 
const creatorMeRoute = require('./routes/auth/Creator/auth'); 
const createCourse = require('./routes/courseCreations/createCourse'); 
const moment = require("moment");
dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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
app.use('/api/creators/signin', creatorSigninRoute);
app.use('/api/students/me', studentMeRoute);
app.use('/api/creator/me', creatorMeRoute);
app.use('/api/createCourse', createCourse);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});