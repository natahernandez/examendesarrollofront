import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

function BookList() {
  const [books, setBooks] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBook, setEditingBook] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Obtener los libros
  const fetchBooks = () => {
    setLoading(true);
    axios
      .get("https://examendesarrollofinal.onrender.com/api/books")
      .then((response) => {
        setBooks(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error al obtener los libros:", error);
        setLoading(false);
      });
  };

  // Obtener géneros
  const fetchGenres = () => {
    axios
      .get("https://examendesarrollofinal.onrender.com/api/genres")
      .then((response) => {
        setGenres(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los géneros:", error);
      });
  };

  useEffect(() => {
    fetchBooks();
    fetchGenres();
  }, []);

  const handleBookClick = (id) => {
    navigate(`/books/${id}`);
  };

  // Confirmar eliminación de libro
  const confirmDeleteBook = (id) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteBook(id);
        Swal.fire("Eliminado", "El libro ha sido eliminado.", "success");
      }
    });
  };

  // Eliminar libro
  const deleteBook = (id) => {
    axios
      .delete(`https://examendesarrollofinal.onrender.com/api/books/${id}`)
      .then(() => {
        setBooks(books.filter((book) => book.id !== id));
      })
      .catch((error) => {
        console.error("Error al eliminar el libro:", error);
      });
  };

  // Actualizar libro
  const updateBook = (book) => {
    axios
      .put(`https://examendesarrollofinal.onrender.com/api/books/${book.id}`, book)
      .then(() => {
        setEditingBook(null);
        setIsModalOpen(false); // Cerrar el modal
        fetchBooks();
      })
      .catch((error) => {
        console.error("Error al actualizar el libro:", error);
      });
  };

  const handleUpdateSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook);
    }
  };

  const handleEditChange = (e) => {
    setEditingBook({
      ...editingBook,
      [e.target.name]: e.target.value,
    });
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-xl mt-10">
        Cargando libros...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Biblioteca Digital
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <div
            key={book.id}
            onClick={() => handleBookClick(book.id)}
            className="bg-white shadow-lg hover:shadow-2xl transition-shadow rounded-lg p-5 flex flex-col justify-between cursor-pointer"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {book.title}
              </h2>
              <p className="text-gray-600 mb-1">
                ✍️ <span className="font-medium">Autor:</span> {book.author}
              </p>
              <p className="text-gray-600 mb-1">
                📅 <span className="font-medium">Año de Publicación:</span>{" "}
                {book.publicationYear}
              </p>
              {book.genre && (
                <p className="text-gray-600 mb-1">
                  📚 <span className="font-medium">Género:</span>{" "}
                  {book.genre.name}
                </p>
              )}
              <div className="mt-4 flex  justify-between">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingBook(book);
                    setIsModalOpen(true);
                  }}
                  className="bg-purple-500 text-white px-4 py-2 rounded mr-2 hover:bg-purple-600 transition"
                >
                  Actualizar
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDeleteBook(book.id);
                  }}
                  className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de edición */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 w-11/12 md:w-1/2 lg:w-1/3">
            <h2 className="text-2xl font-bold mb-4">Editar Libro</h2>
            <form onSubmit={handleUpdateSubmit}>
              <input
                type="text"
                name="title"
                value={editingBook.title}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Título"
              />
              <input
                type="text"
                name="author"
                value={editingBook.author}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Autor"
              />
              <input
                type="number"
                name="publicationYear"
                value={editingBook.publicationYear}
                onChange={handleEditChange}
                className="w-full p-2 mb-2 border rounded"
                placeholder="Año de Publicación"
              />
              <label className="block font-semibold text-gray-700">Género</label>
              <select
                name="genreId"
                value={editingBook.genreId}
                onChange={handleEditChange}
                className="w-full p-2 mb-4 border rounded"
              >
                <option value="">Selecciona un género</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.id}>
                    {genre.name}
                  </option>
                ))}
              </select>
              <div className="flex justify-end  space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookList;
