import { useState, useEffect } from 'react';
import './App.css'; // El CSS que vamos a reemplazar

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
      
      resetForm();
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

  const resetForm = () => {
    setEditingId(null);
    setFormData({ name: '', email: '', phoneNumber: '' });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="app-container">
      <header>
        <h1>SGU - Gestión de Usuarios</h1>
      </header>

      <main className="content-layout">
        {/* ---- FORMULARIO ---- */}
        <div className="form-card card">
          <h2>{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo</label>
              <input 
                id="name"
                name="name" 
                placeholder="Ej: Nombre Ejemplo" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico</label>
              <input 
                id="email"
                name="email" 
                type="email" 
                placeholder="ejemplo@correo.com" 
                value={formData.email} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Teléfono</label>
              <input 
                id="phoneNumber"
                name="phoneNumber" 
                placeholder="Ej: 55 1234 5678" 
                value={formData.phoneNumber} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* ---- TABLA DE USUARIOS ---- */}
        <div className="table-card card">
          <h2>Lista de Usuarios</h2>
          {loading ? <p>Cargando...</p> : (
            <div className="table-wrapper">
              <table>
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
                      <td data-label="Nombre">{user.name}</td>
                      <td data-label="Email">{user.email}</td>
                      <td data-label="Teléfono">{user.phoneNumber}</td>
                      <td data-label="Acciones">
                        <div className="action-buttons">
                          <button className="btn btn-edit" onClick={() => handleEdit(user)}>Editar</button>
                          <button className="btn btn-delete" onClick={() => handleDelete(user.id)}>Borrar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;