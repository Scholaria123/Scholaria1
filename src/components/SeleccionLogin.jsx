import React from "react";
import { Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../App.css";

const SeleccionLogin = () => {
  const navigate = useNavigate();

  return (
    <div className="container mt-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="p-4 shadow">
            <Card.Body>
              <h3 className="text-center mb-4">Selecciona tu tipo de acceso</h3>
              
              {/* Botón para login normal (usuario general) */}
              <Button
                variant="primary"
                onClick={() => navigate("/login")}
                className="mb-3 w-100"
              >
                Iniciar sesión como usuario
              </Button>

              {/* Botón para login de docente */}
              <Button
                variant="secondary"
                onClick={() => navigate("/login-docente")}
                className="w-100"
              >
                Iniciar sesión como docente
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SeleccionLogin;
