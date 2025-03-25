import React from "react";

const TablaAsignaturas = ({ asignaturas, openEditModal, openDeleteModal }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Docente</th>
          <th>Grado</th>
          <th>Nota</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {asignaturas.map((asignatura) => (
          <tr key={asignatura.id}>
            <td>{asignatura.nombre}</td>
            <td>{asignatura.docente}</td>
            <td>{asignatura.grado}</td>
            <td>{asignatura.nota}</td>
            <td>
              <button onClick={() => openEditModal(asignatura)}>Editar</button>
              <button onClick={() => openDeleteModal(asignatura)}>Eliminar</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaAsignaturas;
