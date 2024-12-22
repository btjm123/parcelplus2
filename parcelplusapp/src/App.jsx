import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Map from "./pages/map";
import { BoxConditionChecker } from "./pages/imageUpload";
import Login from "./pages/login";
import "./App.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

function App() {
  return (
    <ChakraProvider>
      <div className="ios">
        <Router>
          <Routes>
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dropzone" element={<BoxConditionChecker />} />
            <Route path="/" element={<Map />} />
          </Routes>
        </Router>
      </div>
    </ChakraProvider>
  );
}

export default App;
