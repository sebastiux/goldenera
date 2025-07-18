import React from "react";
import "../../styles/footer.scss";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Golden Era</h3>
            <p>Transforma tu cuerpo, eleva tu mente</p>
          </div>
          <div className="footer-section">
            <h4>Síguenos</h4>
            <div className="social-links">
              <a href="#" aria-label="Instagram">??</a>
              <a href="#" aria-label="Facebook">??</a>
              <a href="#" aria-label="YouTube">??</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Golden Era. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
