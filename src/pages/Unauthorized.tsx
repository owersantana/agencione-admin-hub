
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, LogIn, ArrowLeft } from "lucide-react";

const Unauthorized = () => {
  useEffect(() => {
    console.error("401 Error: User attempted to access unauthorized content");
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-red-200 mb-4">401</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Acesso não autorizado</h2>
          <p className="text-gray-600 mb-8">
            Você não tem permissão para acessar esta página. Faça login ou verifique suas credenciais.
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
            onClick={() => window.location.href = "/auth/login"}
            className="flex items-center gap-2"
          >
            <LogIn className="h-4 w-4" />
            Fazer Login
          </Button>
          <Button 
            onClick={() => window.location.href = "/"}
            variant="outline"
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

export default Unauthorized;
