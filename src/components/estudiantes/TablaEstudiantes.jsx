import React, { useState, useEffect, useRef } from "react";
import { Image } from "react-bootstrap";
import "./TablaEstudiantes.css";
import { Pencil, Trash2, RotateCcw, XCircle } from "lucide-react";

const TablaEstudiantes = ({
  estudiantes,
  openEditModal,
  openDeleteModal,
  verPapelera,
  restaurarEstudiante,
  eliminarDefinitivamente,
}) => {
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiantesPorPagina = 5;

  const prevIdsRef = useRef(estudiantes.map((e) => e.id));

  useEffect(() => {
    const prevIds = prevIdsRef.current;
    const currentIds = estudiantes.map((e) => e.id);
    const seEliminoAlguien = prevIds.length > currentIds.length;

    if (seEliminoAlguien) {
      setPaginaActual(1);
    }

    prevIdsRef.current = currentIds;
  }, [estudiantes]);

  const indiceUltimo = paginaActual * estudiantesPorPagina;
  const indicePrimero = indiceUltimo - estudiantesPorPagina;
  const estudiantesActuales = estudiantes.slice(indicePrimero, indiceUltimo);
  const totalPaginas = Math.ceil(estudiantes.length / estudiantesPorPagina);

  const cambiarPagina = (numero) => {
    if (numero >= 1 && numero <= totalPaginas) {
      setPaginaActual(numero);
    }
  };

  return (
    <div className="tabla-container">
      <h3 className="tabla-title">
        {verPapelera ? "Papelera de Estudiantes" : "Lista de Estudiantes"}
      </h3>
      <table className="tabla-estilizada">
        <thead>
          <tr>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Dirección</th>
            <th>Teléfono</th>
            <th>
              <strong>Tutor</strong>
            </th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {estudiantesActuales.map((estudiante) => (
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
              <td data-label="Tutor">{estudiante.tutor || "Sin tutor"}</td>
              <td data-label="Acciones" className="acciones">
                {!verPapelera ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <button
                      className="restaurar"
                      onClick={() => restaurarEstudiante(estudiante.id)}
                      title="Restaurar"
                    >
                      <RotateCcw size={18} color="#28a745" />
                    </button>
                    <button
                      className="eliminar-definitivo"
                      onClick={() => eliminarDefinitivamente(estudiante.id)}
                      title="Eliminar permanentemente"
                    >
                      <XCircle size={18} color="#dc3545" />
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="paginacion">
        {Array.from({ length: totalPaginas }, (_, i) => (
          <button
            key={i}
            onClick={() => cambiarPagina(i + 1)}
            className={paginaActual === i + 1 ? "activo" : ""}
          >
          </button>
        ))}
      </div>
    </div>
  );
};

export default TablaEstudiantes;
