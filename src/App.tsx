import { RouterProvider } from "react-router-dom";
import { Router } from "./router";
import { Toaster } from "@/components/ui/toaster";

import "./styles/App.css";
import "./styles/embla.css";
import "./styles/sandbox.css";

function App() {
  return (
    <div className="App theme-dark">
      <Toaster />
      <RouterProvider router={Router} />
    </div>
  );
}

export default App;
