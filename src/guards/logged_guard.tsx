import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { AuthUtils } from "@/utils/authUtils";
import { CloseCircle } from "iconsax-react";
import { Navigate, useLocation } from "react-router-dom";

interface LoggedGuardProps {
  children: React.ReactNode;
}

export const LoggedGuard: React.FC<LoggedGuardProps> = ({ children }) => {
  const location = useLocation();
  const { toast } = useToast();
  const isAuthenticated = AuthUtils.temTokenValido();

  if (!isAuthenticated) {
    toast({
      variant: "destructive",
      title: "Opps! Parece que você não fez login",
      description: "Faça login para poder acessar o sistema",
      action: (
        <ToastAction
          className="bg-transparent border-0 p-0 hover:bg-transparent"
          altText="Goto schedule to undo"
        >
          <CloseCircle size="24" color="#ffffff" variant="Broken" />
        </ToastAction>
      ),
    });

    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

export default LoggedGuard;
