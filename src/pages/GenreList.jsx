import { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

function GenreList() {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newGenre, setNewGenre] = useState({ name: '', description: '' });
  const [editingGenre, setEditingGenre] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchGenres();
  }, []);

  const fetchGenres = () => {
    axios.get('http://localhost:3000/api/genres')
      .then(response => {
        setGenres(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error al obtener los géneros:', error);
        setLoading(false);
      });
  };

  const handleCreateGenre = (e) => {
    e.preventDefault();
    axios.post('http://localhost:3000/api/genres', newGenre)
      .then(response => {
        setGenres([...genres, response.data]);
        setNewGenre({ name: '', description: '' });
        setMessage('Género creado exitosamente');
      })
      .catch(error => {
        setMessage('Error al crear el género');
        console.error('Error al crear el género:', error);
      });
  };

  const handleUpdateGenre = (e) => {
    e.preventDefault();
    if (!editingGenre) return;

    axios.put(`http://localhost:3000/api/genres/${editingGenre.id}`, editingGenre)
      .then(() => {
        setGenres(genres.map(genre => genre.id === editingGenre.id ? editingGenre : genre));
        setEditingGenre(null);
        setMessage('Género actualizado exitosamente');
      })
      .catch(error => {
        setMessage('Error al actualizar el género');
        console.error('Error al actualizar el género:', error);
      });
  };

  const confirmDeleteGenre = (id) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "No podrás revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteGenre(id);
        Swal.fire('Eliminado', 'El género ha sido eliminado.', 'success');
      }
    });
  };

  const deleteGenre = (id) => {
    axios.delete(`http://localhost:3000/api/genres/${id}`)
      .then(() => {
        setGenres(genres.filter(genre => genre.id !== id));
      })
      .catch(error => {
        console.error('Error al eliminar el género:', error);
      });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(''), 3000); 
      return () => clearTimeout(timer);
    }
  }, [message]);

  if (loading) {
    return <p className="text-center text-gray-500 text-xl mt-10">Cargando géneros...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Administrar Géneros</h2>

      {message && (
        <p className={`text-center mb-4 ${message.includes('exitosamente') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} p-2 rounded`}>
          {message}
        </p>
      )}

      <form onSubmit={handleCreateGenre} className="mb-6 space-y-4">
        <h3 className="text-xl font-semibold text-gray-700">Crear Nuevo Género</h3>
        <input
          type="text"
          placeholder="Nombre del Género"
          value={newGenre.name}
          onChange={(e) => setNewGenre({ ...newGenre, name: e.target.value })}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Descripción"
          value={newGenre.description}
          onChange={(e) => setNewGenre({ ...newGenre, description: e.target.value })}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition">
          Crear Género
        </button>
      </form>

      <ul className="divide-y divide-gray-200">
        {genres.map((genre) => (
          <li key={genre.id} className="py-4">
            {editingGenre && editingGenre.id === genre.id ? (
              <form onSubmit={handleUpdateGenre} className="space-y-2">
                <input
                  type="text"
                  value={editingGenre.name}
                  onChange={(e) => setEditingGenre({ ...editingGenre, name: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Nombre del Género"
                />
                <input
                  type="text"
                  value={editingGenre.description}
                  onChange={(e) => setEditingGenre({ ...editingGenre, description: e.target.value })}
                  className="w-full p-2 border rounded"
                  placeholder="Descripción"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setEditingGenre(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    Guardar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{genre.name}</h3>
                  <p className="text-gray-600">{genre.description}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingGenre(genre)}
                    className="text-blue-600 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => confirmDeleteGenre(genre.id)}
                    className="text-red-600 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GenreList;
