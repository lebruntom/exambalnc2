import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import './AdminDashboard.css';
import VehiculeList from './VehiculeList';
import Header from './Header';
import ClientsInscrits from './ClientsInscrits';
const baseURI = import.meta.env.VITE_API_BASE_URL;

const AdminDashboard = () => {
  const [clientCount, setClientCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientCount = async () => {
      try {
        const response = await fetch(baseURI + 'api/clients/count', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
        if (response.ok) {
          const data = await response.json();
          setClientCount(data.count);
        } else {
          alert('Erreur lors de la récupération du nombre de clients');
          navigate('/')
        }
      } catch (error) {
        alert('Erreur réseau');
        navigate('/')
      }
    };

    fetchClientCount();
  }, []);

  return (
    <div>
      <Header/>
        <div className="admin-dashboard">
          <h2>Tableau de bord admin</h2>
          <ClientsInscrits nbClients={clientCount}/>

          <button onClick={()=> navigate('vehicule/add')}>Ajouter un véhicule</button>
          <VehiculeList/>
        </div>
    </div>
  );
};

export default AdminDashboard;
