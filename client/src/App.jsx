import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthPage from './components/AuthPage';
import AdminDashboard from './components/Dashboard';
import './App.css';
import UpdateVehicule from './components/UpdateVehicule';
import AddVehicule from './components/AddVehicule';


function App() {

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/vehicule/:id" element={<UpdateVehicule />} />
          <Route path="/dashboard/vehicule/add" element={<AddVehicule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;