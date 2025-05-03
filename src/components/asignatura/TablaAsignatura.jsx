import React from "react";
import { Pencil, Trash2 } from "lucide-react";
import "./TablaAsignatura.css"; 

const TablaAsignaturas = ({ asignaturas, openEditModal, openDeleteModal }) => {
  return (
    <div className="tabla-container">
      <h3 className="tabla-title">Lista de Asignaturas</h3>
      <table className="tabla-estilizada">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Docente</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asignaturas.length > 0 ? (
            asignaturas.map((asignatura) => (
              <tr key={asignatura.id}>
                <td data-label="Nombre">{asignatura.nombre}</td>
                <td data-label="Docente">{asignatura.docente}</td>
                <td data-label="Grado">
                  {Array.isArray(asignatura.grado)
                    ? asignatura.grado.map((g, index) => (
                        <span key={index} className="badge bg-primary me-1">
                          {g}
                        </span>
                      ))
                    : asignatura.grado
                        ?.match(/([0-9]+[a-zA-Z]+)/g)
                        ?.map((g, index) => (
                          <span key={index} className="badge bg-primary me-1">
                            {g}
                          </span>
                        ))}
                </td>
                <td data-label="Grupo">
                  {Array.isArray(asignatura.grupo)
                    ? asignatura.grupo.map((g, index) => (
                        <span key={index} className="badge bg-secondary me-1">
                          {g}
                        </span>
                      ))
                    : asignatura.grupo
                        ?.split("")
                        .map((g, index) => (
                          <span key={index} className="badge bg-secondary me-1">
                            {g}
                          </span>
                        ))}
                </td>
                <td data-label="Acciones" className="acciones">
                  <button
                    className="editar"
                    onClick={() => openEditModal(asignatura)}
                  >
                    <Pencil size={18} color="#fff" />
                  </button>
                  <button
                    className="eliminar"
                    onClick={() => openDeleteModal(asignatura)}
                  >
                    <Trash2 size={18} color="#fff" />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay asignaturas registradas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TablaAsignaturas;
