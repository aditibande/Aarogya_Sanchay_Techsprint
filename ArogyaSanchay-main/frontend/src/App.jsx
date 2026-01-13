import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LandingPage from './components/LandingPage';
import SignUp from './components/SignUp';
import AddRecords from './components/AddRecords';
import DashBoard from './components/DashBoard';
import GovernmentDashboard from './components/GovernmentDashboard';
import HealthIdPage from './components/HealthIdPage';
import HealthIdForm from './components/HealthIdForm';
import LoginPage from './components/LoginPage';
import PhoneLogin from './components/PhoneLogin';
import ViewRecords from './components/ViewRecords';
import HealthIDCard from './components/HealthIdCard';
import HeatmapsPage from './components/HeatmapsPage';
import MigrantsList from './components/MigrantsList';
import NotificationPage from './components/NotificationPage';
import Home from './components/pages/Home';
import Resources from './components/pages/Resources';
import VideoPage from './components/pages/VideoPage';



function App() {
  const [count, setCount] = useState(0)

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/phone-login" element={<PhoneLogin />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/health-id" element={<HealthIdPage />} />
        <Route path="/health-id/form" element={<HealthIdForm />} />
        <Route path="/health-id/card" element={<HealthIDCard />} />

        <Route path="/migrants" element={<MigrantsList />} />
        <Route path="/add-record" element={<AddRecords />} />
        <Route path="/view-records" element={<ViewRecords />} />
        <Route path="/migrants" element={<MigrantsList />} />
        <Route path="/heatmaps" element={<HeatmapsPage />} />
        <Route path="/notifications" element={<NotificationPage />} />
        <Route path="/government-dashboard" element={<GovernmentDashboard />} />

        <Route path="/home" element={<Home />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/videos" element={<VideoPage />} />


      </Routes>
    </BrowserRouter>


  )
}

export default App
