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
const studentDashboard = require('./routes/student/dashboard');
const creatorMeRoute = require('./routes/auth/Creator/auth');
const createCourse = require('./routes/course/createCourse');
const FetchById = require('./routes/course/fetchById');
const fetchAllCoures = require('./routes/course/fetchAllCoures');
const StreamCourse = require('./routes/course/StreamCourse');
const updateProgress = require('./routes/course/updateProgress');
const fetchCourseProgress = require('./routes/course/fetchCourseProgress');
const fetchExchangeCode = require('./routes/transaction/fetchExchangeCode');
const fetchAllCommunity = require('./routes/community/fetchAllCommunity');
const addMessage = require('./routes/community/addMessage');
const fetchMessage = require('./routes/community/fetchMessage');
const Buy = require('./routes/transaction/buy');
const Rent = require('./routes/transaction/rent');
const createExchangeRequst = require('./routes/transaction/createExchangeRequst');
const fetchExchangeRequest = require('./routes/transaction/fetchExchangeRequest');
const fetchTransaction = require('./routes/transaction/fetchTransaction');
const Exchange = require('./routes/transaction/exchange');
const creatorDashboard = require('./routes/creator/dashboard');
const studentProfile = require('./routes/student/profile');
const studentShareProfile = require('./routes/student/shareProfile');
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
app.use('/api/fetchAllCoures', fetchAllCoures);
app.use('/api/fetchById', FetchById);
app.use('/api/buy', Buy);
app.use('/api/rent', Rent);
app.use('/api/fetchTransaction', fetchTransaction);
app.use('/api/exchange', Exchange);
app.use('/api/createExchangeRequst', createExchangeRequst);
app.use('/api/fetchExchangeRequest', fetchExchangeRequest);
app.use('/api/students/studentDashboard', studentDashboard);
app.use('/api/StreamCourse', StreamCourse);
app.use('/api/student/update-progress', updateProgress);
app.use('/api/student/fetchCourseProgress', fetchCourseProgress);
app.use('/api/student/fetchMYExchangeCode', fetchExchangeCode);
app.use('/api/user/communities', fetchAllCommunity);
app.use('/api/communities/addMessage', addMessage);
app.use('/api/communities/fetchMessage', fetchMessage);
app.use('/api/creator/dashboard', creatorDashboard);
app.use('/api/student/profile', studentProfile);
app.use('/api/student/shareProfile', studentShareProfile);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

