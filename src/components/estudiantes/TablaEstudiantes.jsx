import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaEstudiantes = ({ estudiantes, openEditModal, openDeleteModal }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Nombre</th>
          <th>Asignatura</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {estudiantes.map((estudiante) => (
          <tr key={estudiante.id}>
            <td>
              {estudiante.imagen ? (
                <Image src={estudiante.imagen} width="50" height="50" rounded />
              ) : (
                "Sin imagen"
              )}
            </td>
            <td>{estudiante.nombre}</td>
            {/* Aquí mostramos el nombre de la asignatura en lugar del ID */}
            <td>{estudiante.asignaturaNombre || "Sin asignatura"}</td>
            <td>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => openEditModal(estudiante)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => openDeleteModal(estudiante)}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default TablaEstudiantes;
