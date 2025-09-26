// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./styles/components/variables.css"; // Variables CSS y temas
import "./styles/components/base.css"; // Estilos base y utilitarios
import "./styles/components/buttons.css"; // Estilos de botones
import "./styles/components/forms.css"; // Estilos de formularios
import "./styles/components/cards.css"; // Estilos de cards
import "./styles/components/modals.css"; // Estilos de modales
import "./styles/components/tables.css"; // Estilos de tablas
import "./styles/components/alerts.css"; // Estilos de alertas

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);