import { useEffect, useState } from 'react';
import './SigninForm.css';
import { useNavigate } from 'react-router-dom'
const baseURI = import.meta.env.VITE_API_BASE_URL

const SigninForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(baseURI + 'api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          CSRF: csrfToken
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });
      if (response.ok) {
        alert('Connexion réussie');
        const res = await response.json()
        if(res.role === 'admin'){
          navigate('/dashboard')
        }
      } else {
        alert('Erreur lors de la connexion');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  return (
    <form className="signin-form" onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
      <button type="submit">Se connecter</button>
    </form>
  );
};

export default SigninForm;