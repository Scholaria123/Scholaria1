import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import Scholaria_logo from "../assets/Scholaria_logo.png";
import { useAuth } from "../database/authcontext";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../App.css";

const Encabezado = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsCollapsed(false);
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminPassword");
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const handleToggle = () => setIsCollapsed(!isCollapsed);

  const handleNavigate = (path) => {
    navigate(path);
    setIsCollapsed(false);
  };

  return (
    <Navbar expand="sm" fixed="top" className="color-navbar">
      <Container>
        <Navbar.Brand
          onClick={() => handleNavigate("/inicio")}
          className="text-white"
          style={{ cursor: "pointer" }}
        >
          <img
            alt=""
            src={Scholaria_logo}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          <strong>Scholaria</strong>
        </Navbar.Brand>
  
        <Navbar.Toggle
          aria-controls="offcanvasNavbar-expand-sm"
          onClick={handleToggle}
          className="custom-toggler"
        >
          <span className="toggler-bar"></span>
          <span className="toggler-bar"></span>
          <span className="toggler-bar"></span>
        </Navbar.Toggle>
  
        <Navbar.Offcanvas
          id="offcanvasNavbar-expand-sm"
          aria-labelledby="offcanvasNavbarLabel-expand-sm"
          placement="end"
          show={isCollapsed}
          onHide={() => setIsCollapsed(false)}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title
              id="offcanvasNavbarLabel-expand-sm"
              className={isCollapsed ? "color-texto-marca" : "text-white"}
            >
              Menú
            </Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-end flex-grow-1 pe-3">
              <Nav.Link
                onClick={() => handleNavigate("/inicio")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-house-door-fill me-2"></i>}
                <strong>Inicio</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Estudiantes")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-people-fill me-2"></i>}
                <strong>Estudiantes</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Asignatura")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-journal-bookmark-fill me-2"></i>}
                <strong>Asignaturas</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Asistencia")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-calendar-check-fill me-2"></i>}
                <strong>Asistencia</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Docentes")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-person-badge-fill me-2"></i>}
                <strong>Docentes</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Calendario")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-calendar-event-fill me-2"></i>}
                <strong>Calendario</strong>
              </Nav.Link>
  
              <Nav.Link
                onClick={() => handleNavigate("/Calificaciones")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-file-earmark-bar-graph-fill me-2"></i>}
                <strong>Calificaciones</strong>
              </Nav.Link>

              <Nav.Link
                onClick={() => handleNavigate("/CatalogoCalificaciones")}
                className={isCollapsed ? "color-texto-marca" : "text-white"}
              >
                {isCollapsed && <i className="bi-file-earmark-bar-graph-fill me-2"></i>}
                <strong>Busca tu estudiante</strong>
              </Nav.Link>
  
              {isLoggedIn ? (
                <Nav.Link
                  onClick={handleLogout}
                  className={isCollapsed ? "text-black" : "text-white"}
                >
                  Cerrar Sesión
                </Nav.Link>
              ) : location.pathname === "/" && (
                <Nav.Link
                  onClick={() => handleNavigate("/")}
                  className={isCollapsed ? "text-black" : "text-white"}
                >
                  Iniciar Sesión
                </Nav.Link>
              )}
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  );
};  

export default Encabezado;
