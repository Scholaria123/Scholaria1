import React from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaDocente = ({ docentes, openEditModal, openDeleteModal }) => {
  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Docente</th>
          <th>Asignatura</th>
          <th>Título</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {docentes.map((docente) => (
          <tr key={docente.id}>
            <td>
              {docente.imagen ? (
                <Image src={docente.imagen} width="50" height="50" rounded />
              ) : (
                "Sin imagen"
              )}
            </td>
            <td>{docente.docente}</td>
            <td>{docente.asignaturaNombre}</td>
            <td>{docente.titulo}</td>
            <td>{docente.direccion}</td>
            <td>{docente.telefono}</td>
            <td>
              <Button
                variant="outline-warning"
                size="sm"
                className="me-2"
                onClick={() => openEditModal(docente)}
              >
                <i className="bi bi-pencil"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => openDeleteModal(docente)}
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

export default TablaDocente;
