import { CommonLoading } from "@/components/loading/CommonLoading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { IUsers } from "@/interfaces/IUser";
import { UsersService } from "@/services/users-service";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { CloseCircle } from "iconsax-react";
import { AuthUtils } from "@/utils/authUtils";
import { UsersTypeEnum } from "@/interfaces/Enums/UsersTypeEnum";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UsersInfoTabProps {
  selectedUsers: IUsers[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<IUsers[]>>;
  handleGetUsers: () => void;
  setRowSelection: React.Dispatch<React.SetStateAction<{}>>;
  setOpenAddDialog: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  setHeader: (component: React.ReactNode) => void;
}

export const UsersInfoTab = ({
  selectedUsers,
  setSelectedUsers,
  handleGetUsers,
  setRowSelection,
  setOpenAddDialog,
  setIsEdit,
  setHeader,
}: UsersInfoTabProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<boolean>(false);

  const handleDeleteUsers = async () => {
    setLoading(true);
    try {
      const response = await UsersService.deleteListUsers(selectedUsers);

      if (response.status === 204) {
        toast({
          variant: "success",
          title: "Usuários deletados com sucesso!",
          action: (
            <ToastAction
              className="bg-transparent border-0 p-0 hover:bg-transparent"
              altText="Goto schedule to undo"
            >
              <CloseCircle size="24" color="#ffffff" variant="Broken" />
            </ToastAction>
          ),
        });

        handleCleanInfoTab();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCleanInfoTab = () => {
    setRowSelection({});
    setSelectedUsers([]);
    handleGetUsers();
    setHeader(null);
  };

  const handleClickEdit = () => {
    setIsEdit(true);
    setOpenAddDialog(true);
  };

  return (
    <Card className="section-info-tab w-full bg-foreground mt-8">
      <CardHeader className="bg-foreground_100 rounded-t-lg">
        <CardTitle className="font-KumbhSans font-semibold text-xl text-white">
          Detalhes dos usuários
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardContent>
        {selectedUsers.map((user) => {
          return (
            <Accordion
              key={user.id}
              type="single"
              collapsible
              className="w-full"
            >
              <AccordionItem value={`user-${user.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-3 font-Inter font-semibold text-base text-foreground_80">
                    <Avatar className="max-w-10 max-h-10 overflow-hidden">
                      <AvatarImage src={user.avatar} alt="@shadcn" />
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((palavra) => palavra[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {user.name}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4">
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      REF ID
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {user.id}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      EMAIL
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {user.email}
                    </Label>
                  </div>
                  <div className="flex flex-col">
                    <Label className="font-Inter font-medium text-xs text-foreground_80">
                      TIPO
                    </Label>
                    <Label className="font-Inter font-semibold text-base text-foreground_80">
                      {user.type.type}
                    </Label>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          );
        })}
      </CardContent>
      <CardFooter>
        <div className="w-full flex items-center justify-between">
          <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
              <TooltipTrigger
                className={`${
                  !AuthUtils.verifyLoggedUserIsAdmin() && "cursor-not-allowed"
                }`}
              >
                <Button
                  variant={"secondary_outline"}
                  type="submit"
                  onClick={handleClickEdit}
                  disabled={!AuthUtils.verifyLoggedUserIsAdmin()}
                >
                  {loading ? <CommonLoading size="6" color="#fff" /> : "EDITAR"}
                </Button>
              </TooltipTrigger>
              {!AuthUtils.verifyLoggedUserIsAdmin() && (
                <TooltipContent>
                  <p>
                    Somente {UsersTypeEnum.Administrador} podem editar alunos
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider disableHoverableContent={true}>
            <Tooltip>
              <TooltipTrigger
                className={`${
                  !AuthUtils.verifyLoggedUserIsAdmin() && "!cursor-not-allowed"
                }`}
              >
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"destructive_outline"}
                      disabled={loading || !AuthUtils.verifyLoggedUserIsAdmin()}
                    >
                      {loading ? (
                        <CommonLoading size="6" color="#fff" />
                      ) : (
                        "DELETAR"
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Tem certeza que deseja deletar os usuários selecionados?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Está ação não poderá ser desfeita. Isto irá deletar
                        permanentimente a conta dos usuários do sistema
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteUsers}>
                        Continuar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              {!AuthUtils.verifyLoggedUserIsAdmin() && (
                <TooltipContent>
                  <p>
                    Somente {UsersTypeEnum.Administrador} podem deletar alunos
                  </p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardFooter>
    </Card>
  );
};
