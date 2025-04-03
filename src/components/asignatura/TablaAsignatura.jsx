import React from "react";

const TablaAsignaturas = ({ asignaturas, openEditModal, openDeleteModal }) => {
  return (
    <table className="table table-striped table-hover">
      <thead className="thead-dark">
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
              <td>{asignatura.nombre}</td>
              <td>{asignatura.docente}</td>
              <td>{Array.isArray(asignatura.grado) ? asignatura.grado.join(", ") : asignatura.grado}</td> 
              <td>{Array.isArray(asignatura.grupo) ? asignatura.grupo.join(", ") : asignatura.grupo}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => openEditModal(asignatura)}
                >
                  ✏️ Editar
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => openDeleteModal(asignatura)}
                >
                  🗑 Eliminar
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
  );
};

export default TablaAsignaturas;
