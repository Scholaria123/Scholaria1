import { Card, Col } from "react-bootstrap";
import "./TarjetaCalificaciones.css";

const TarjetaCalificaciones = ({ estudiante }) => {
  return (
    <Col lg={3} md={4} sm={12} className="mb-4">
      <Card>
        {estudiante.imagen && (
          <Card.Img
            variant="top"
            src={estudiante.imagen}
            alt={estudiante.nombre}
            style={{
              width: "100%",  
              height: "200px",  
              objectFit: "cover",  
              borderTopLeftRadius: "10px",  
              borderTopRightRadius: "10px",
            }}
          />
        )}
        <Card.Body>
          <Card.Title>{estudiante.nombre}</Card.Title>
          <Card.Text>
            Grado: {estudiante.grado} <br />
            Grupo: {estudiante.grupo} <br />
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TarjetaCalificaciones;
