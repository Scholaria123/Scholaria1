import { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import "./Asistencia.css";

const HistorialAsistencias = () => {
  const [asistencias, setAsistencias] = useState([]);
  const [gradoFiltro, setGradoFiltro] = useState("");
  const [grupoFiltro, setGrupoFiltro] = useState("");
  const [estudiantes, setEstudiantes] = useState({});
  const [asignaturas, setAsignaturas] = useState([]);
  const [gradosUnicos, setGradosUnicos] = useState([]);
  const [gruposUnicos, setGruposUnicos] = useState([]);
  const [editando, setEditando] = useState(null); // Asistencia seleccionada para edición
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevoEstado, setNuevoEstado] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const asistenciaSnap = await getDocs(collection(db, "asistencias"));
    const estudiantesSnap = await getDocs(collection(db, "estudiantes"));
    const asignaturasSnap = await getDocs(collection(db, "asignaturas"));

    const estudiantesMap = {};
    const gradosSet = new Set();
    const gruposSet = new Set();

    estudiantesSnap.forEach((doc) => {
      const data = doc.data();
      estudiantesMap[doc.id] = data;
      if (data.grado) gradosSet.add(data.grado);
      if (data.grupo) gruposSet.add(data.grupo.toUpperCase());
    });

    const asignaturasList = [];
    asignaturasSnap.forEach((doc) => {
      asignaturasList.push({ id: doc.id, ...doc.data() });
    });

    const asistenciaList = [];
    asistenciaSnap.forEach((doc) => {
      asistenciaList.push({ id: doc.id, ...doc.data() });
    });

    setEstudiantes(estudiantesMap);
    setAsignaturas(asignaturasList);
    setAsistencias(asistenciaList);
    setGradosUnicos([...gradosSet].sort());
    setGruposUnicos([...gruposSet].sort());
  };

  const eliminarAsistencia = async (id) => {
    const confirmacion = window.confirm("¿Estás seguro de eliminar esta asistencia?");
    if (!confirmacion) return;
    await deleteDoc(doc(db, "asistencia", id));
    setAsistencias((prev) => prev.filter((a) => a.id !== id));
  };

  const editarAsistencia = (asistencia) => {
    setEditando(asistencia);
    setNuevaFecha(asistencia.fecha);
    setNuevoEstado(asistencia.estado);
  };

  const guardarEdicion = async () => {
    if (!editando) return;

    await updateDoc(doc(db, "asistencias", editando.id), {
      fecha: nuevaFecha,
      estado: nuevoEstado,
    });

    setAsistencias((prev) =>
      prev.map((a) => (a.id === editando.id ? { ...a, fecha: nuevaFecha, estado: nuevoEstado } : a))
    );

    setEditando(null); // Cierra el modal
  };

  const asistenciasFiltradas = asistencias.filter((a) => {
    const estudiante = estudiantes[a.estudianteId];
    if (!estudiante) return false;
    return (
      (!gradoFiltro || estudiante.grado === gradoFiltro) &&
      (!grupoFiltro || estudiante.grupo?.toUpperCase() === grupoFiltro)
    );
  });

  const obtenerNombreEstudiante = (id) => estudiantes[id]?.nombre || "Desconocido";
  const obtenerGrado = (id) => estudiantes[id]?.grado || "N/A";
  const obtenerGrupo = (id) => estudiantes[id]?.grupo?.toUpperCase() || "N/A";
  const obtenerNombreAsignatura = (id) =>
    asignaturas.find((a) => a.id === id)?.nombre || "N/A";

  return (
    <div className="asistencia-container">
      <h2>Historial de Asistencias</h2>

      <div>
        <label>Filtrar por Grado: </label>
        <select value={gradoFiltro} onChange={(e) => setGradoFiltro(e.target.value)}>
          <option value="">Todos</option>
          {gradosUnicos.map((grado) => (
            <option key={grado} value={grado}>{grado}</option>
          ))}
        </select>

        <label>Filtrar por Grupo: </label>
        <select value={grupoFiltro} onChange={(e) => setGrupoFiltro(e.target.value)}>
          <option value="">Todos</option>
          {gruposUnicos.map((grupo) => (
            <option key={grupo} value={grupo}>{grupo}</option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Grado</th>
            <th>Grupo</th>
            <th>Asignatura</th>
            <th>Fecha</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {asistenciasFiltradas.map((a) => (
            <tr key={a.id}>
              <td>{obtenerNombreEstudiante(a.estudianteId)}</td>
              <td>{obtenerGrado(a.estudianteId)}</td>
              <td>{obtenerGrupo(a.estudianteId)}</td>
              <td>{obtenerNombreAsignatura(a.asignaturaId)}</td>
              <td>{a.fecha}</td>
              <td>{a.estado}</td>
              <td>
                <button onClick={() => editarAsistencia(a)} style={{ marginRight: "8px" }}>
                  Editar
                </button>
                <button onClick={() => eliminarAsistencia(a.id)} style={{ backgroundColor: "red", color: "white" }}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal de edición */}
      {editando && (
        <div className="modal">
          <div className="modal-content">
            <h3>Editar Asistencia</h3>
            <p><strong>Estudiante:</strong> {obtenerNombreEstudiante(editando.estudianteId)}</p>
            <label>Fecha:</label>
            <input type="date" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} />

            <label>Estado:</label>
            <select value={nuevoEstado} onChange={(e) => setNuevoEstado(e.target.value)}>
              <option value="Presente">Presente</option>
              <option value="Ausente">Ausente</option>
              <option value="Justificado">Justificado</option>
            </select>

            <div style={{ marginTop: "10px" }}>
              <button onClick={guardarEdicion}>Guardar</button>
              <button onClick={() => setEditando(null)} style={{ marginLeft: "10px" }}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistorialAsistencias;
