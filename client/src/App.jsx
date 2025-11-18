import { useState, useEffect } from 'react';
// import './App.css'; // Importamos los estilos (Comentado para la vista previa)

function App() {
  // --- Definición de la URL de la API (Usando variables de entorno de Vite) ---
  // Se agregan valores por defecto para compatibilidad con entornos (como esta vista previa)
  // donde 'import.meta.env' podría no estar disponible.
  const HOST = (import.meta.env && import.meta.env.VITE_API_HOST) || 'localhost';
  const PORT = (import.meta.env && import.meta.env.VITE_API_PORT) || '8081';
  const BASE = (import.meta.env && import.meta.env.VITE_API_BASE) || '/sgu-api';
  const API_URL = `http://${HOST}:${PORT}${BASE}/users`;

  // --- Estados del Componente ---
  // Almacena la lista de usuarios
  const [users, setUsers] = useState([]);
  // Controla el formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: ''
  });
  // Para saber si estamos editando o creando
  const [editingId, setEditingId] = useState(null);
  // Para manejar errores y carga
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // --- EFECTOS ---
  // Se ejecuta una vez cuando el componente se carga
  useEffect(() => {
    fetchUsers();
  }, []);

  // --- FUNCIONES (Lógica del CRUD) ---

  // R = READ (Leer todos los usuarios)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Error al obtener los usuarios');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // C = CREATE / U = UPDATE (Manejador del formulario)
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita que la página se recargue

    // Determina si es CREATE (POST) o UPDATE (PUT)
    const isEditing = editingId !== null;
    const url = isEditing ? `${API_URL}/${editingId}` : API_URL;
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar el usuario');

      // Si todo salió bien:
      resetForm(); // Limpia el formulario
      fetchUsers(); // Recarga la lista de usuarios
      
    } catch (err) {
      setError(err.message);
    }
  };

  // D = DELETE (Borrar un usuario)
  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres borrar este usuario?')) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al borrar el usuario');

      // Recarga la lista de usuarios
      fetchUsers();

    } catch (err) {
      setError(err.message);
    }
  };

  // --- Funciones Auxiliares ---

  // Carga los datos de un usuario en el formulario para editar
  const handleEdit = (user) => {
    setEditingId(user.id);
    setFormData({
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
    });
  };

  // Limpia el formulario y cancela el modo edición
  const resetForm = () => {
    setEditingId(null);
    setFormData({
      name: '',
      email: '',
      phoneNumber: '',
    });
  };

  // Actualiza el estado del formulario mientras el usuario escribe
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  // --- RENDERIZADO (Lo que se ve en la pantalla) ---
  return (
    <div className="app-container">
      <header>
        <h1>SGU - Gestión de Usuarios</h1>
      </header>

      <main>
        {/* ---- FORMULARIO ---- */}
        <div className="form-card">
          <h2>{editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nombre Completo:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Correo Electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Teléfono:</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn-submit">
                {editingId ? 'Actualizar' : 'Guardar'}
              </button>
              {editingId && (
                <button type="button" className="btn-cancel" onClick={resetForm}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
          {error && <p className="error-message">{error}</p>}
        </div>

        {/* ---- TABLA DE USUARIOS ---- */}
        <div className="table-card">
          <h2>Lista de Usuarios</h2>
          {loading && <p>Cargando usuarios...</p>}
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phoneNumber}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => handleEdit(user)}>
                      Editar
                    </button>
                    <button className="btn-delete" onClick={() => handleDelete(user.id)}>
                      Borrar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;