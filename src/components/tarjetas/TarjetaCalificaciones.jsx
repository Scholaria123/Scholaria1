import { Card, Col } from "react-bootstrap";

const TarjetaCalificaciones = ({ estudiante }) => {
  return (
    <Col lg={3} md={4} sm={12} className="mb-4">
      <Card>
        {estudiante.imagen && (
          <Card.Img variant="top" src={estudiante.imagen} alt={estudiante.nombre} />
        )}
        <Card.Body>
          <Card.Title>{estudiante.nombre}</Card.Title>
          <Card.Text>
  Grado: {estudiante.grado} <br />
  Grupo: {estudiante.grupo} <br />
  Asignatura: {estudiante.asignaturaNombre} <br />
  Docente: {estudiante.docente}
</Card.Text>

        </Card.Body>
      </Card>
    </Col>
  );
};

export default TarjetaCalificaciones;