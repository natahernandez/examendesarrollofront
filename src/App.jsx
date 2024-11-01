import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import BookList from "./pages/BookList";
import CreateBook from "./components/forms/CreateBook";
import BookDetail from "./pages/BookDetail";
import GenreList from "./pages/GenreList";

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <header className="bg-blue-600 text-white">
          <div className="container mx-auto p-4 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Sistema de Gestión de Biblioteca</h1>
            <nav className="flex space-x-4">
              <Link
                to="/"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Lista de Libros
              </Link>
              <Link
                to="/create"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Crear Libro
              </Link>
              <Link
                to="/generos"
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-200 transition"
              >
                Generos literarios
              </Link>
            </nav>
          </div>
        </header>

        <main className="container mx-auto py-8">
          <Routes>
            <Route path="/" element={<BookList />} />
            <Route path="/create" element={<CreateBook />} />
            <Route path="/books/:id" element={<BookDetail />} />
            <Route path="/generos" element={<GenreList />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
