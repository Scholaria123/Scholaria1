import React from "react";
import { Image } from "react-bootstrap";
import { Pencil, Trash2 } from "lucide-react";
import "./TablaDocente.css";

const TablaDocente = ({ docentes, openEditModal, openDeleteModal }) => {
  return (
    <div className="tabla-container">
      <h3 className="tabla-title">Lista de Docentes</h3>
      <table className="tabla-estilizada">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Docente</th>
            <th>Asignatura</th>
            <th>Título</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Carnet</th> {/* Nueva columna para el carnet */}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {docentes.map((docente) => (
            <tr key={docente.id}>
              <td data-label="Imagen">
                {docente.imagen ? (
                  <Image src={docente.imagen} roundedCircle />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td data-label="Docente">{docente.docente}</td>
              <td data-label="Asignatura">{docente.asignaturaNombre}</td>
              <td data-label="Título">{docente.titulo}</td>
              <td data-label="Dirección">{docente.direccion}</td>
              <td data-label="Teléfono">{docente.telefono}</td>
              <td data-label="Carnet">{docente.carnet}</td> {/* Mostrar carnet */}
              <td data-label="Acciones" className="acciones">
                <button
                  className="editar"
                  onClick={() => openEditModal(docente)}
                >
                  <Pencil size={18} color="#fff" />
                </button>
                <button
                  className="eliminar"
                  onClick={() => openDeleteModal(docente)}
                >
                  <Trash2 size={18} color="#fff" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TablaDocente;
