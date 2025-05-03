import React from "react";
import { Image } from "react-bootstrap";
import "./TablaEstudiantes.css";
import { Pencil, Trash2 } from "lucide-react";

const TablaEstudiantes = ({ estudiantes, openEditModal, openDeleteModal }) => {
  return (
    <div className="tabla-container">
      <h3 className="tabla-title">Lista de Estudiantes</h3>
      <table className="tabla-estilizada">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantes.map((estudiante) => (
            <tr key={estudiante.id}>
              <td data-label="Imagen">
                {estudiante.imagen ? (
                  <Image src={estudiante.imagen} roundedCircle />
                ) : (
                  "Sin imagen"
                )}
              </td>
              <td data-label="Nombre">{estudiante.nombre}</td>
              <td data-label="Dirección">{estudiante.direccion}</td>
              <td data-label="Teléfono">{estudiante.telefono}</td>
              <td data-label="Acciones" className="acciones">
                <button
                  className="editar"
                  onClick={() => openEditModal(estudiante)}
                >
                  <Pencil size={18} color="#fff" />
                </button>
                <button
                  className="eliminar"
                  onClick={() => openDeleteModal(estudiante)}
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

export default TablaEstudiantes;
