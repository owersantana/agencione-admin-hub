
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { Button } from "@/components/ui/button";
import { Clock, RefreshCw } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export default function Block() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  const handleRefreshSession = async () => {
    setIsRefreshing(true);
    
    // Simular tentativa de renovar sessão
    setTimeout(() => {
      toast({
        title: "Sessão expirada",
        description: "Sua sessão não pôde ser renovada. Faça login novamente.",
        variant: "destructive",
      });
      setIsRefreshing(false);
      navigate("/auth/login");
    }, 2000);
  };

  const handleBackToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <AuthLayout
      icon={<Clock size={48} />}
      title="Sessão expirada"
      description="Sua sessão foi encerrada por inatividade"
      showTerms={false}
    >
      <div className="space-y-6">
        {/* Informações sobre a sessão */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-center">
          <div className="text-amber-800 text-sm space-y-2">
            <p className="font-medium">Por motivos de segurança</p>
            <p>Sua sessão foi encerrada após 30 minutos de inatividade</p>
          </div>
        </div>

        {/* Tempo de expiração */}
        <div className="text-center space-y-2">
          <div className="text-xs text-muted-foreground">
            Sessão encerrada às
          </div>
          <div className="text-sm font-mono bg-muted px-3 py-1 rounded">
            {new Date().toLocaleTimeString('pt-BR')}
          </div>
        </div>

        {/* Botões de ação */}
        <div className="space-y-3">
          <Button 
            onClick={handleRefreshSession} 
            className="w-full" 
            disabled={isRefreshing}
            variant="outline"
          >
            {isRefreshing ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Verificando sessão...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Tentar renovar sessão
              </>
            )}
          </Button>

          <Button onClick={handleBackToLogin} className="w-full">
            Fazer login novamente
          </Button>
        </div>

        {/* Link adicional */}
        <div className="text-center">
          <Link
            to="/auth/forgot-password"
            className="text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            Esqueci minha senha
          </Link>
        </div>

        {/* Dicas de segurança */}
        <div className="text-xs text-muted-foreground text-center space-y-1">
          <p>💡 <strong>Dica:</strong> Mantenha-se ativo na plataforma para evitar desconexões</p>
          <p>🔒 Suas informações estão sempre protegidas</p>
        </div>
      </div>
    </AuthLayout>
  );
}
