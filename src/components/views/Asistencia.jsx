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

  const getButtonStyles = (id, estado) => ({
    ...styles[`button${estado}`],
    opacity: asistencia[id] === estado ? 1 : 0.5,
  });

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
    <div style={styles.container}>
      <h2 style={styles.title}>Registro de Asistencia</h2>

      <label style={styles.label}>
        <Calendar size={16} style={styles.icon} /> Fecha:
      </label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>
        <School size={16} style={styles.icon} /> Grado:
      </label>
      <select
        value={gradoSeleccionado}
        onChange={(e) => {
          setGradoSeleccionado(e.target.value);
          setGrupoSeleccionado("");
          setAsignaturaSeleccionada("");
        }}
        style={styles.select}
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
          <label style={styles.label}>
            <Users size={16} style={styles.icon} /> Grupo:
          </label>
          <select
            value={grupoSeleccionado}
            onChange={(e) => {
              setGrupoSeleccionado(e.target.value);
              setAsignaturaSeleccionada("");
            }}
            style={styles.select}
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
          <label style={styles.label}>
            <BookOpen size={16} style={styles.icon} /> Asignatura:
          </label>
          <select
            value={asignaturaSeleccionada}
            onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
            style={styles.select}
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
          <div style={{ fontSize: "12px", color: "#666" }}>
            Usa los botones para marcar asistencia
          </div>
        </>
      )}

      {asignaturaSeleccionada && estudiantes.length === 0 && (
        <p style={styles.message}>No hay estudiantes en este grado y grupo.</p>
      )}

      <div style={styles.studentsContainer}>
        {estudiantes.map(({ id, nombre }) => (
          <div key={id} style={styles.studentRow}>
            <span style={styles.studentName}>{nombre}</span>
            <button
              style={getButtonStyles(id, "Presente")}
              onClick={() => marcarAsistencia(id, "Presente")}
            >
              <Check size={16} />
            </button>
            <button
              style={getButtonStyles(id, "Ausente")}
              onClick={() => marcarAsistencia(id, "Ausente")}
            >
              <X size={16} />
            </button>
            <button
              style={getButtonStyles(id, "Justificado")}
              onClick={() => marcarAsistencia(id, "Justificado")}
            >
              <Circle size={16} />
            </button>
          </div>
        ))}
      </div>

      <button onClick={guardarAsistencia} style={styles.buttonSave}>
        <Save size={16} style={styles.icon} /> Guardar Asistencia
      </button>
      <button onClick={generarPDF} style={styles.buttonPDF}>
        <FileText size={16} style={styles.icon} /> Generar PDF
      </button>
      <button
        onClick={() => setMostrarTablaResumen((prev) => !prev)}
        style={styles.buttonResumen}
      >
        {mostrarTablaResumen ? (
          <>
            <ChevronDown size={16} style={styles.icon} /> Ocultar resumen
          </>
        ) : (
          <>
            <ChevronUp size={16} style={styles.icon} /> Ver resumen
          </>
        )}
      </button>

      {mostrarTablaResumen && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Estudiante</th>
                <th style={styles.th}>Grado</th>
                <th style={styles.th}>Grupo</th>
                <th style={styles.th}>Asignatura</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesPagina.map(({ id, nombre }) => (
                <tr key={id}>
                  <td style={styles.td}>{nombre}</td>
                  <td style={styles.td}>{gradoSeleccionado}</td>
                  <td style={styles.td}>{grupoSeleccionado.toUpperCase()}</td>
                  <td style={styles.td}>{nombreAsignatura}</td>
                  <td style={styles.td}>{asistencia[id] || "No marcado"}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.paginacion}>
            <button
              onClick={() => cambiarPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              style={styles.pageButton}
            >
              <ChevronLeft size={16} /> Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              style={styles.pageButton}
            >
              Siguiente <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "750px",
    margin: "auto",
    marginTop: "30px",
    padding: "25px",
    borderRadius: "16px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  title: { marginBottom: "20px", fontSize: "24px", color: "#333" },
  label: {
    fontWeight: "600",
    display: "block",
    marginTop: "15px",
    textAlign: "left",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  message: { color: "red", marginTop: "10px" },
  studentsContainer: { marginTop: "20px" },
  studentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    padding: "10px 15px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  studentName: { flex: 1, textAlign: "left", fontWeight: "500" },
  buttonPresente: {
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    margin: "0 4px",
    cursor: "pointer",
  },
  buttonAusente: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    margin: "0 4px",
    cursor: "pointer",
  },
  buttonJustificado: {
    backgroundColor: "#ffc107",
    color: "#333",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    margin: "0 4px",
    cursor: "pointer",
  },
  buttonSave: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  buttonPDF: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#6f42c1",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  buttonResumen: {
    marginTop: "20px",
    padding: "10px 20px",
    backgroundColor: "#17a2b8",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px",
    borderRadius: "6px 6px 0 0",
  },
  td: {
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  paginacion: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pageButton: {
    padding: "8px 12px",
    backgroundColor: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default Asistencia;
