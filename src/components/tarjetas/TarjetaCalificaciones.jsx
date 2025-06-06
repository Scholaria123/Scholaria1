import { Card, Col } from "react-bootstrap";
import "./TarjetaCalificaciones.css";
import { Fade, Zoom } from "react-awesome-reveal";

const TarjetaCalificaciones = ({ estudiante }) => {
  return (
    <Col lg={3} md={4} sm={12} className="mb-4">
      {/* Animación de entrada combinada: Fade + Zoom */}
      <Fade triggerOnce delay={100} duration={500}>
        <Zoom triggerOnce delay={100} duration={300}>
          <Card className="shadow-hover"> {/* Clase opcional para efecto hover */}
            {/* Contenedor para la imagen (evita distorsión) */}
            <div style={{ overflow: "hidden", borderRadius: "10px 10px 0 0" }}>
              {estudiante.imagen && (
                <Card.Img
                  variant="top"
                  src={estudiante.imagen}
                  alt={estudiante.nombre}
                  style={{
                    width: "100%",
                    height: "200px",
                    objectFit: "cover",
                    transition: "transform 0.3s ease", // Para hover (opcional)
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                  onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                />
              )}
            </div>

            <Card.Body>
              <Card.Title className="fw-bold">{estudiante.nombre}</Card.Title>
              <Card.Text>
                <span className="d-block">Grado: {estudiante.grado}</span>
                <span className="d-block">Grupo: {estudiante.grupo}</span>
              </Card.Text>
            </Card.Body>
          </Card>
        </Zoom>
      </Fade>
    </Col>
  );
};

export default TarjetaCalificaciones;
