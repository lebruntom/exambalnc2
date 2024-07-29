import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import './UpdateVehicule.css';
import Header from './Header';

const UpdateVehicule = () => {
    const baseURI = import.meta.env.VITE_API_BASE_URL;

    const {id} = useParams()
    const navigate = useNavigate()
    const [clients, setClients] = useState([])

    const [formData, setFormData] = useState({
        annee: '',
        immat: '',
        marque: '',
        modele: '',
        client_id: ''
    });


    
  const [csrfToken, setCsrfToken] = useState("")

  useEffect(() => {

    fetch(baseURI + 'api/csrf-token', {
      method: 'GET', 
      headers: {
        'Content-Type': 'application/json', 
      },
    })
    .then(response => response.json()) 
    .then(data => {
      setCsrfToken(data.csrfToken)
    })
    .catch(error => {
      console.error('Erreur lors de la récupération du CSRF token:', error);
    });
  }, []);


useEffect(()=> {


    const fetchClients = async () => {
        try {
          const response = await fetch(baseURI + 'api/clients', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            setClients(data);
          } else {
            alert('Erreur lors de la récupération du nombre de clients');
            navigate('/')
          }
        } catch (error) {
          alert('Erreur réseau');
          navigate('/')
        }
      };
  
      fetchClients();


    if(id){

        fetch(baseURI + `api/vehicule/${id}`, {
            method: 'GET', 
            headers: {
            'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json()) 
        .then(data => {

            setFormData((ps)=> ({ annee: data.vehicule[0].annee,
                immat: data.vehicule[0].immat,
                marque: data.vehicule[0].marque,
                modele: data.vehicule[0].modele,
                client_id: data.vehicule[0].id ?? "" }))
        })
        .catch(error => {
            console.error('Erreur lors de la récupération des vehicules:', error);
        });


    }
}, [id])


const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
        const response = await fetch(baseURI + `api/vehicule/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            CSRF: csrfToken
          },
          credentials: 'include',
          body: JSON.stringify(formData)
        });
        
        navigate('/dashboard')

      } catch (error) {
        alert('Erreur réseau');
      }

  }

    return (
        <div>
            <Header/>
            <form className='update_form' onSubmit={handleSubmit}>
                <h2>Modifier le véhicule</h2>
                <input type="text" name="annee" placeholder="Année" value={formData.annee} onChange={handleChange} required />
                <input type="text" name="immat" placeholder="Immatriculation" value={formData.immat} onChange={handleChange} required />
                <input type="text" name="marque" placeholder="Marque" value={formData.marque} onChange={handleChange} required />
                <input type="text" name="modele" placeholder="Modele" value={formData.modele} onChange={handleChange} required />
                <select value={formData.client_id} onChange={handleChange} name='client_id'>
                <option value="" >Choisir un client</option>
                {clients.map(client => (
                <option key={client.id} value={client.id}>
                    {client.firstname} {client.lastname}
                </option>
                ))}
            </select>
                <button type="submit">Modifier</button>

            </form>
        </div>
    
    );
};

export default UpdateVehicule;