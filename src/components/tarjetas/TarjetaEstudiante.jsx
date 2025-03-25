import { Card, Col } from "react-bootstrap";

const TarjetaEstudiante = ({ estudiante }) => {
  return (
    <Col lg={3} md={4} sm={12} className="mb-4">
      <Card>
        {estudiante.imagen && (
          <Card.Img variant="top" src={estudiante.imagen} alt={estudiante.nombre} />
        )}
        <Card.Body>
          <Card.Title>{estudiante.nombre}</Card.Title>
          <Card.Text>
            Asignatura: {estudiante.asignatura} <br />
            Nota: {estudiante.nota || "N/A"}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default TarjetaEstudiante;
