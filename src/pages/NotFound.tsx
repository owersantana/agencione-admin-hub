
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Página não encontrada</h2>
          <p className="text-gray-600 mb-8">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            onClick={() => window.history.back()}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button 
            onClick={() => window.location.href = "/"}
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Página Inicial
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
