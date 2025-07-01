
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, RefreshCw, ArrowLeft } from "lucide-react";

const ServerError = () => {
  useEffect(() => {
    console.error("500 Error: Internal server error occurred");
  }, []);

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-orange-50">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-yellow-200 mb-4">500</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Erro interno do servidor</h2>
          <p className="text-gray-600 mb-8">
            Algo deu errado em nossos servidores. Tente novamente em alguns instantes.
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
            onClick={handleRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Tentar Novamente
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

export default ServerError;
