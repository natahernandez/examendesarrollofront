import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";

function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [copies, setCopies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCopy, setSelectedCopy] = useState(null);
  const [newCopy, setNewCopy] = useState({
    status: "disponible",
    location: "",
  });

  useEffect(() => {
    axios
      .get(`https://examendesarrollofinal.onrender.com/api/books/${id}`)
      .then((response) => setBook(response.data))
      .catch((error) => console.error("Error al obtener el libro:", error));

    axios
      .get(`https://examendesarrollofinal.onrender.com/api/copies/${id}`)
      .then((response) => setCopies(response.data))
      .catch((error) => console.error("Error al obtener las copias:", error))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCreateOrUpdateCopy = () => {
    const apiEndpoint = isEditing
      ? `https://examendesarrollofinal.onrender.com/api/copies/${selectedCopy.id}`
      : "https://examendesarrollofinal.onrender.com/api/copies"; 

    const request = isEditing
      ? axios.put(apiEndpoint, { ...newCopy, bookId: id })
      : axios.post(apiEndpoint, { ...newCopy, bookId: id });

    request
      .then((response) => {
        if (isEditing) {
          setCopies((prevCopies) =>
            prevCopies.map((copy) =>
              copy.id === selectedCopy.id ? response.data : copy
            )
          );
        } else {
          setCopies([...copies, response.data]);
        }
        setIsModalOpen(false);
        setNewCopy({ status: "disponible", location: "" });
        setIsEditing(false);
        setSelectedCopy(null);
      })
      .catch((error) =>
        console.error("Error al crear o actualizar la copia:", error)
      );
  };

  const handleEditCopy = (copy) => {
    setSelectedCopy(copy);
    setNewCopy({ status: copy.status, location: copy.location });
    setIsModalOpen(true);
    setIsEditing(true);
  };

  const confirmDeleteCopy = (copyId) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "Esta acción eliminará la copia y no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        handleDeleteCopy(copyId);
      }
    });
  };

  const handleDeleteCopy = (copyId) => {
    axios
      .delete(`https://examendesarrollofinal.onrender.com/api/copies/${copyId}`)
      .then(() => {
        setCopies(copies.filter((copy) => copy.id !== copyId));
        Swal.fire("Eliminado", "La copia ha sido eliminada.", "success");
      })
      .catch((error) => console.error("Error al eliminar la copia:", error));
  };

  const handleInputChange = (e) => {
    setNewCopy({ ...newCopy, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <p className="text-center text-gray-500 text-xl mt-10">
        Cargando detalles del libro...
      </p>
    );
  }

  if (!book) {
    return (
      <p className="text-center text-gray-500 text-xl mt-10">
        No se encontraron detalles para este libro.
      </p>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-blue-600 hover:underline"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Regresar a la Página Principal
        </button>

        <button
          onClick={() => {
            setIsModalOpen(true);
            setIsEditing(false);
            setNewCopy({ status: "disponible", location: "" });
          }}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Crear copia
        </button>
      </div>

      <h2 className="text-4xl font-bold text-gray-800 mb-4">{book.title}</h2>
      <p className="text-gray-700 text-lg">
        <span className="font-semibold">✍️ Autor:</span> {book.author}
      </p>
      <p className="text-gray-700 text-lg">
        <span className="font-semibold">📅 Año de Publicación:</span>{" "}
        {book.publicationYear}
      </p>
      {book.genre && (
        <p className="text-gray-700 text-lg">
          <span className="font-semibold">📚 Género:</span> {book.genre.name}{" "}
          <span className="text-sm text-gray-500">
            {" "}
            - {book.genre.description}
          </span>
        </p>
      )}

      <h3 className="text-2xl font-semibold text-gray-800 mt-6 mb-2">
        Copias Disponibles
      </h3>
      <ul className="divide-y divide-gray-200">
        {copies.length > 0 ? (
          copies.map((copy) => (
            <li
              key={copy.id}
              className="py-3 flex flex-col md:flex-row items-center md:items-center justify-center md:justify-between text-gray-700 gap-4"
            >
              <div className="text-center md:text-left">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    copy.status === "disponible"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {copy.status}
                </span>
              </div>
              <div className="text-sm font-medium text-gray-800 w-full md:w-auto text-center md:text-left">
                Ubicación: {copy.location}
              </div>
              <div className="flex space-x-2 justify-center md:justify-start">
                <button
                  onClick={() => handleEditCopy(copy)}
                  className="text-blue-600 hover:underline text-sm md:text-base"
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDeleteCopy(copy.id)}
                  className="text-red-600 hover:underline text-sm md:text-base"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No hay copias disponibles</p>
        )}
      </ul>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-bold mb-4">
              {isEditing ? "Editar Copia" : "Nueva Copia"}
            </h3>
            <label className="block text-gray-700 mb-2">Estado</label>
            <select
              name="status"
              value={newCopy.status}
              onChange={handleInputChange}
              className="w-full p-2 mb-4 border rounded"
            >
              <option value="disponible">Disponible</option>
              <option value="no disponible">No Disponible</option>
            </select>

            <label className="block text-gray-700 mb-2">Ubicación</label>
            <input
              type="text"
              name="location"
              value={newCopy.location}
              onChange={handleInputChange}
              placeholder="Ubicación"
              className="w-full p-2 mb-4 border rounded"
            />

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditing(false);
                  setSelectedCopy(null);
                }}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateOrUpdateCopy}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
              >
                {isEditing ? "Actualizar" : "Guardar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookDetail;
