import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import CourseBinding from './screens/CourseBinding';
import reportWebVitals from './reportWebVitals';
import StreamingCourse from './screens/StreamingCourse';
import Signup from './screens/Signup'
import Signin from './screens/Signin'
import Transaction from './screens/chainTransaction';
import Dashboard from './screens/dashboard';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/coursebinding" element={<CourseBinding />} />
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
