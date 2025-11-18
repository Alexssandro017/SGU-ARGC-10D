import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // Configuración de la URL usando variables de entorno
  const HOST = import.meta.env.VITE_API_HOST || 'localhost';
  const PORT = import.meta.env.VITE_API_PORT || '8081';
  const BASE = import.meta.env.VITE_API_BASE || '/sgu-api';
  const API_URL = `http://${HOST}:${PORT}${BASE}/users`;

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al conectar con el servidor');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar');
      
      setEditingId(null);
      setFormData({ name: '', email: '', phoneNumber: '' });
      fetchUsers();
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Borrar usuario?')) return;
    try {
      await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      fetchUsers();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-container">
      <h1>SGU - Gestión de Usuarios</h1>
      
      <div className="form-card">
        <h2>{editingId ? 'Editar' : 'Crear'} Usuario</h2>
        <form onSubmit={handleSubmit}>
          <input 
            name="name" 
            placeholder="Nombre Completo" 
            value={formData.name} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            name="email" 
            type="email" 
            placeholder="Correo Electrónico" 
            value={formData.email} 
            onChange={handleInputChange} 
            required 
          />
          <input 
            name="phoneNumber" 
            placeholder="Teléfono" 
            value={formData.phoneNumber} 
            onChange={handleInputChange} 
            required 
          />
          <button type="submit">{editingId ? 'Actualizar' : 'Guardar'}</button>
        </form>
        {error && <p style={{color: 'red'}}>{error}</p>}
      </div>

      <div className="table-card">
        {loading ? <p>Cargando...</p> : (
          <table border="1" style={{width: '100%', marginTop: '20px'}}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Editar</button>
                    <button onClick={() => handleDelete(user.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;