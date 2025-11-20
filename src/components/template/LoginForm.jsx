import React from "react";
import FormMolecules from "../molecules/FormMolecules";
import SideimagsForm from "../molecules/SideimagsForm";

const LoginForm = () => {
  return (
    <div className="flex flex-col lg:flex-row h-screen w-full">
      <div className="flex-1 flex items-center justify-center p-4">
        <FormMolecules />
      </div>

      <div className="flex-1 hidden lg:flex">
        <SideimagsForm />
      </div>
    </div>
  );
};

export default LoginForm;
