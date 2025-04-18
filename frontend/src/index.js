import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import CourseBuying from './screens/CourseBuying';
import CourseExchange from './screens/CourseExchange';
import reportWebVitals from './reportWebVitals';
import StreamingCourse from './screens/StreamingCourse';
import Signup from './screens/Signup'
import Signin from './screens/Signin'
import Transaction from './screens/chainTransaction';
import Dashboard from './screens/dashboard';
import Community from './screens/Community';
import Profile from './screens/profile';
import Home from './screens/Home'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/CourseBuying" element={<CourseBuying />} />
        <Route path="/CourseExchange" element={<CourseExchange />} />
        <Route path="/streamingcourse" element={<StreamingCourse />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
