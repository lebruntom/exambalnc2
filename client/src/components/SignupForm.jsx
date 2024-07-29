import { useEffect, useState } from 'react';
import './SignupForm.css';
const baseURI = import.meta.env.VITE_API_BASE_URL

const SignupForm = () => {
  const [formData, setFormData] = useState({
    lastname: '',
    firstname: '',
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
      const response = await fetch(baseURI + 'api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          CSRF: csrfToken
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Inscription réussie');
      } else {
        alert('Erreur lors de l\'inscription');
      }
    } catch (error) {
      alert('Erreur réseau');
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>Inscription</h2>
      <input type="text" name="lastname" placeholder="Nom" value={formData.lastname} onChange={handleChange} required />
      <input type="text" name="firstname" placeholder="Prénom" value={formData.firstname} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} required />
      <button type="submit">S'inscrire</button>
    </form>
  );
};

export default SignupForm;