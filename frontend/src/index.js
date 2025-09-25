import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Profile from './components/Profile';
import Faculty from './components/Faculty';
import Publications from './components/Publications';
import Patents from './components/Patents';
import Books from './components/Books';
import ResearchGuidanceStudents from './components/ResearchGuidanceStudents';
import Experience from './components/Experience';
import HODVerification from './components/HODVerification';
import FacultyManagement from './components/FacultyManagement';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path='/profile'  element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path='/faculty'  element={
          <ProtectedRoute>
            <Faculty />
          </ProtectedRoute>
        } />
        <Route path='/publications'  element={
          <ProtectedRoute>
            <Publications />
          </ProtectedRoute>
        } />
        <Route path='/patents'  element={
          <ProtectedRoute>
            <Patents />
          </ProtectedRoute>
        } />
        <Route path='/books'  element={
          <ProtectedRoute>
            <Books />
          </ProtectedRoute>
        } />
        <Route path='/research-guidance'  element={
          <ProtectedRoute>
            <ResearchGuidanceStudents />
          </ProtectedRoute>
        } />
        <Route path='/experience'  element={
          <ProtectedRoute>
            <Experience />
          </ProtectedRoute>
        } />
        <Route path='/hod-verification'  element={
          <ProtectedRoute>
            <HODVerification />
          </ProtectedRoute>
        } />
        <Route path='/faculty-management'  element={
          <ProtectedRoute>
            <FacultyManagement />
          </ProtectedRoute>
        } />
        <Route path='*' element={<Login />} />
        <Route path='/' element={<Login />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
