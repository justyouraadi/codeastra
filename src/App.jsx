import React from "react";
import RoutesFile from "./RoutesFile";
import { Toaster } from "react-hot-toast";
import "./App.css"

const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />
      <RoutesFile />
    </div>
  );
};

export default App;
