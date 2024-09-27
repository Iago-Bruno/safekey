// import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { Outlet } from "react-router-dom";

type formDataType = {
  name: string;
  matricula: string;
  email: string;
  password: string;
  is_admin: boolean;
};

export type UserOutLetContext = {
  formData: formDataType;
  setFormData: any;
  showPassword: boolean;
  setShowPassword: any;
  progressLength: boolean;
  setProgressLength: any;
};

export const RegisterLayout = () => {
  const [formData, setFormData] = useState<formDataType>({
    name: "",
    matricula: "",
    email: "",
    password: "",
    is_admin: true,
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [progressLength, setProgressLength] = useState<number>(100);

  return (
    <div className="register-layout h-screen max-h-screen flex flex-col items-center">
      <span className="background-header absolute top-0 z-0 w-screen h-[36%] bg-blue_2" />

      <div className="register-steps w-screen h-screen flex flex-col bg-gray_5 items-center justify-center">
        <Outlet
          context={{
            formData,
            setFormData,
            showPassword,
            setShowPassword,
            progressLength,
            setProgressLength,
          }}
        />
      </div>

      {/* <Progress className="w-[60%] mb-16" value={progressLength} /> */}
    </div>
  );
};
