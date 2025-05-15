import { useState, useEffect } from "react";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import jsPDF from "jspdf";
import {
  Calendar,
  School,
  Users,
  BookOpen,
  Check,
  X,
  Circle,
  Save,
  FileText,
  Table,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./Asistencia.css";


const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [grupos, setGrupos] = useState(["a", "b"]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [grupoSeleccionado, setGrupoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);
  const [mostrarTablaResumen, setMostrarTablaResumen] = useState(false);
  const [paginaActual, setPaginaActual] = useState(1);
  const estudiantesPorPagina = 5;

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "asignaturas"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAsignaturas(lista);

        const gradosUnicos = [
          ...new Set(lista.flatMap((a) => a.grado.map((g) => g))),
        ];
        gradosUnicos.sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true })
        );
        setGrados(gradosUnicos);
      } catch (error) {
        console.error("Error cargando asignaturas:", error);
      }
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    if (!gradoSeleccionado || !grupoSeleccionado) {
      setEstudiantes([]);
      return;
    }

    const obtenerEstudiantes = async () => {
      try {
        const q = query(
          collection(db, "estudiantes"),
          where("grado", "==", gradoSeleccionado),
          where("grupo", "==", grupoSeleccionado)
        );
        const snapshot = await getDocs(q);
        const lista = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre,
          }))
          .sort((a, b) => a.nombre.localeCompare(b.nombre));
        setEstudiantes(lista);
      } catch (error) {
        console.error("Error cargando estudiantes:", error);
      }
    };
    obtenerEstudiantes();
  }, [gradoSeleccionado, grupoSeleccionado]);

  const marcarAsistencia = (estudianteId, estado) => {
    setAsistencia((prev) => ({
      ...prev,
      [estudianteId]: estado,
    }));
  };

  const guardarAsistencia = async () => {
    if (!asignaturaSeleccionada || !fecha) {
      alert("Completa todos los campos.");
      return;
    }

    const faltantes = estudiantes.filter((e) => !asistencia[e.id]);
    if (faltantes.length > 0) {
      alert("Faltan estudiantes por marcar asistencia.");
      return;
    }

    try {
      const registros = Object.entries(asistencia);

      for (const [estudianteId, estado] of registros) {
        const q = query(
          collection(db, "asistencia"),
          where("fecha", "==", fecha),
          where("asignaturaId", "==", asignaturaSeleccionada),
          where("estudianteId", "==", estudianteId)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          await addDoc(collection(db, "asistencia"), {
            fecha,
            asignaturaId: asignaturaSeleccionada,
            estudianteId,
            estado,
          });
        } else {
          console.log(
            `Asistencia ya registrada para estudiante ${estudianteId} el ${fecha}`
          );
        }
      }

      alert("Asistencia guardada correctamente.");
    } catch (error) {
      console.error("Error guardando asistencia:", error);
    }
  };

  const generarPDF = () => {
    const doc = new jsPDF();
    const asignatura = asignaturas.find((a) => a.id === asignaturaSeleccionada);
    const nombreAsignatura = asignatura ? asignatura.nombre : "Asignatura";

    doc.text(`Asistencia - ${fecha}`, 10, 10);
    doc.text(`Asignatura: ${nombreAsignatura}`, 10, 20);

    let y = 30;
    estudiantes.forEach(({ id, nombre }) => {
      const estado = asistencia[id] || "No marcado";
      doc.text(`${nombre}: ${estado}`, 10, y);
      y += 10;
    });

    doc.save(`Asistencia_${fecha}.pdf`);
  };

  const nombreAsignatura =
    asignaturas.find((a) => a.id === asignaturaSeleccionada)?.nombre || "";

  const totalPaginas = Math.ceil(estudiantes.length / estudiantesPorPagina);
  const indiceInicial = (paginaActual - 1) * estudiantesPorPagina;
  const estudiantesPagina = estudiantes.slice(
    indiceInicial,
    indiceInicial + estudiantesPorPagina
  );

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setPaginaActual(nuevaPagina);
    }
  };

  return (
    <div className="asistencia-container">
      <h2>Registro de Asistencia</h2>

      <label>
        <Calendar size={16} /> Fecha:
      </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <label>
        <School size={16} /> Grado:
      </label>
      <select
        value={gradoSeleccionado}
        onChange={(e) => {
          setGradoSeleccionado(e.target.value);
          setGrupoSeleccionado("");
          setAsignaturaSeleccionada("");
        }}
      >
        <option value="">-- Selecciona un grado --</option>
        {grados.map((g, i) => (
          <option key={i} value={g}>
            {g}
          </option>
        ))}
      </select>

      {gradoSeleccionado && (
        <>
          <label>
            <Users size={16} /> Grupo:
          </label>
          <select
            value={grupoSeleccionado}
            onChange={(e) => {
              setGrupoSeleccionado(e.target.value);
              setAsignaturaSeleccionada("");
            }}
          >
            <option value="">-- Selecciona un grupo --</option>
            {grupos.map((g, i) => (
              <option key={i} value={g}>
                {g.toUpperCase()}
              </option>
            ))}
          </select>
        </>
      )}

      {gradoSeleccionado && grupoSeleccionado && (
        <>
          <label>
            <BookOpen size={16} /> Asignatura:
          </label>
          <select
            value={asignaturaSeleccionada}
            onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
          >
            <option value="">-- Selecciona una asignatura --</option>
            {asignaturas
              .filter(
                (a) =>
                  a.grado.includes(gradoSeleccionado) &&
                  a.grupo.includes(grupoSeleccionado)
              )
              .map((a) => (
                <option key={a.id} value={a.id}>
                  {a.nombre}
                </option>
              ))}
          </select>
        </>
      )}

      {asignaturaSeleccionada && (
        <>
          <p>
            <b>Grado:</b> {gradoSeleccionado} | <b>Grupo:</b>{" "}
            {grupoSeleccionado.toUpperCase()} | <b>Asignatura:</b>{" "}
            {nombreAsignatura}
          </p>
          <div>
            Usa los botones para marcar asistencia
          </div>
        </>
      )}

      {asignaturaSeleccionada && estudiantes.length === 0 && (
        <p>No hay estudiantes en este grado y grupo.</p>
      )}

      <div>
        {estudiantes.map(({ id, nombre }) => (
          <div key={id}>
            <span>{nombre}</span>
                <button
                  onClick={() => marcarAsistencia(id, "Presente")}
                  className="presente"
                >
                  <Check size={16} />
                </button>
                <button
                  onClick={() => marcarAsistencia(id, "Ausente")}
                  className="ausente"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={() => marcarAsistencia(id, "Justificado")}
                  className="justificado"
                >
                  <Circle size={16} />
                </button>
          </div>
        ))}
      </div>

      <button onClick={guardarAsistencia}>
        <Save size={16} /> Guardar Asistencia
      </button>
      <button onClick={generarPDF}>
        <FileText size={16} /> Generar PDF
      </button>
      <button onClick={() => setMostrarTablaResumen((prev) => !prev)}>
        {mostrarTablaResumen ? (
          <>
            <ChevronDown size={16} /> Ocultar resumen
          </>
        ) : (
          <>
            <ChevronUp size={16} /> Ver resumen
          </>
        )}
      </button>

      {mostrarTablaResumen && (
        <>
          <table>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Grado</th>
                <th>Grupo</th>
                <th>Asignatura</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesPagina.map(({ id, nombre }) => (
                <tr key={id}>
                  <td>{nombre}</td>
                  <td>{gradoSeleccionado}</td>
                  <td>{grupoSeleccionado.toUpperCase()}</td>
                  <td>{nombreAsignatura}</td>
                  <td>{asistencia[id] || "No marcado"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div>
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Asistencia;