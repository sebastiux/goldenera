import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import WhatsAppWidget from "../ui/WhatsAppWidget";
import "../../styles/layout.scss";

const Layout: React.FC = () => {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppWidget 
        phoneNumber="+525576966262" // Reemplaza con tu número real
        message="¡Hola! Me gustaría obtener más información sobre Golden Era"
      />
    </div>
  );
};

export default Layout;