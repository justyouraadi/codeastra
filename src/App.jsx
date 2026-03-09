import React from "react";
import RoutesFile from "./RoutesFile";
// import { Toaster } from "react-hot-toast";
import "./App.css"
import { Toaster } from "sonner";

const App = () => {
  return (
    <div>
      <Toaster richColors position="top-right" />
      <RoutesFile />
    </div>
  );
};

export default App;
