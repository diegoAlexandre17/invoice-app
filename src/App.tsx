import { BrowserRouter } from "react-router-dom";
import Router from "./router/Router";
import { useAuth } from "./hooks/useAuth";

function App() {
  const { loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación inicial
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </>
  );
}

export default App;
