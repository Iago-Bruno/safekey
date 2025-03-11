import { RouterProvider } from "react-router-dom";
import { Router } from "./router";
import { Toaster } from "@/components/ui/toaster";

import "./styles/App.css";

function App() {
  return (
    <div className="App">
      <Toaster />
      <RouterProvider router={Router} />
    </div>
  );
}

export default App;
