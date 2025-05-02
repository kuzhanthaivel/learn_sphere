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
import CreatorCommunity from './screens/creators/creatorCommunity';
import Profile from './screens/profile';
import SharableProfile from './screens/sharableProfile';
import Home from './screens/Home'
import Certificate from './screens/Certificate'
import CretorSignup from './screens/creators/cretorSignup'
import CreatorSignin from './screens/creators/creatorSignin'
import CreaorDashboard from './screens/creators/CreaorDashboard'
import CreateCourse from './screens/creators/CreateCourse'

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/Community" element={<Community />} />
        <Route path="/CreatorCommunity" element={<CreatorCommunity />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/sharableProfile/:id" element={<SharableProfile />} />
        <Route path="/CourseBuying/:id" element={<CourseBuying />} />
        <Route path="/CourseExchange/:id" element={<CourseExchange />} />
        <Route path="/streamingcourse/:id" element={<StreamingCourse />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/transaction" element={<Transaction />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/CretorSignup" element={<CretorSignup />} />
        <Route path="/CreaorDashboard" element={<CreaorDashboard />} />
        <Route path="/CreatorSignin" element={<CreatorSignin />} />
        <Route path="/CreateCourse" element={<CreateCourse />} />
        <Route path="/Certificate/:id" element={<Certificate />} />

      </Routes>
    </Router>
  </React.StrictMode>
);

reportWebVitals();
