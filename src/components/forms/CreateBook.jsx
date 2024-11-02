import { useState, useEffect } from 'react';
import axios from 'axios';

function CreateBook() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [genreId, setGenreId] = useState('');
  const [genres, setGenres] = useState([]); 
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('https://examendesarrollofinal.onrender.com/api/genres')
      .then(response => {
        setGenres(response.data); 
      })
      .catch(error => {
        console.error('Error al obtener los géneros:', error);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); 

    const newBook = {
      title,
      author,
      publicationYear: parseInt(publicationYear),
      genreId: parseInt(genreId),
    };

    try {
      const response = await axios.post('https://examendesarrollofinal.onrender.com/api/books', newBook, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setMessage('Libro creado exitosamente');
      console.log(response.data);
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setGenreId('');
    } catch (error) {
      setMessage('Error al crear el libro');
      console.error(error);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear Nuevo Libro</h2>
      {message && (
        <p className={`text-center mb-4 ${message.includes('exitosamente') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700">Título</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Autor</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Año de Publicación</label>
          <input
            type="number"
            value={publicationYear}
            onChange={(e) => setPublicationYear(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Género</label>
          <select
            value={genreId}
            onChange={(e) => setGenreId(e.target.value)}
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Selecciona un género</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Crear Libro
        </button>
      </form>
    </div>
  );
}

export default CreateBook;
