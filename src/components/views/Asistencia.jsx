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

const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
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
        const gradosUnicos = [...new Set(lista.map((a) => String(a.grado)))];
        setGrados(gradosUnicos);
      } catch (error) {
        console.error("Error cargando asignaturas:", error);
      }
    };
    obtenerDatos();
  }, []);

  useEffect(() => {
    if (!gradoSeleccionado) {
      setEstudiantes([]);
      return;
    }

    const obtenerEstudiantes = async () => {
      try {
        const q = query(
          collection(db, "estudiantes"),
          where("grado", "==", gradoSeleccionado)
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
  }, [gradoSeleccionado]);

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

      <label style={styles.label}>Fecha:</label>
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        style={styles.input}
      />

      <label style={styles.label}>Grado:</label>
      <select
        value={gradoSeleccionado}
        onChange={(e) => {
          setGradoSeleccionado(e.target.value);
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
          <label style={styles.label}>Asignatura:</label>
          <select
            value={asignaturaSeleccionada}
            onChange={(e) => setAsignaturaSeleccionada(e.target.value)}
            style={styles.select}
          >
            <option value="">-- Selecciona una asignatura --</option>
            {asignaturas
              .filter((a) => String(a.grado) === String(gradoSeleccionado))
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
            <b>Grado:</b> {gradoSeleccionado} | <b>Asignatura:</b>{" "}
            {nombreAsignatura}
          </p>
          <div style={{ fontSize: "12px", color: "#666" }}>
            Usa los botones para marcar asistencia
          </div>
        </>
      )}

      {asignaturaSeleccionada && estudiantes.length === 0 && (
        <p style={styles.message}>No hay estudiantes en este grado.</p>
      )}

      <div style={styles.studentsContainer}>
        {estudiantes.map(({ id, nombre }) => (
          <div key={id} style={styles.studentRow}>
            <span style={styles.studentName}>{nombre}</span>
            <button
              style={getButtonStyles(id, "Presente")}
              onClick={() => marcarAsistencia(id, "Presente")}
            >
              {asistencia[id] === "Presente" ? "✅ Presente" : "Presente"}
            </button>
            <button
              style={getButtonStyles(id, "Ausente")}
              onClick={() => marcarAsistencia(id, "Ausente")}
            >
              {asistencia[id] === "Ausente" ? "❌ Ausente" : "Ausente"}
            </button>
            <button
              style={getButtonStyles(id, "Justificado")}
              onClick={() => marcarAsistencia(id, "Justificado")}
            >
              {asistencia[id] === "Justificado"
                ? "🟡 Justificado"
                : "Justificado"}
            </button>
          </div>
        ))}
      </div>

      <button onClick={guardarAsistencia} style={styles.buttonSave}>
        Guardar Asistencia
      </button>
      <button onClick={generarPDF} style={styles.buttonPDF}>
        Generar PDF
      </button>
      <button
        onClick={() => setMostrarTablaResumen((prev) => !prev)}
        style={styles.buttonResumen}
      >
        {mostrarTablaResumen ? "Ocultar resumen" : "Ver resumen en tabla"}
      </button>

      {mostrarTablaResumen && (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Estudiante</th>
                <th style={styles.th}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantesPagina.map(({ id, nombre }) => (
                <tr key={id}>
                  <td style={styles.td}>{nombre}</td>
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
              ⬅️ Anterior
            </button>
            <span>
              Página {paginaActual} de {totalPaginas}
            </span>
            <button
              onClick={() => cambiarPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              style={styles.pageButton}
            >
              Siguiente ➡️
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "650px",
    margin: "auto",
    marginTop: "30px",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#f9f9f9",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: { marginBottom: "15px" },
  label: { fontWeight: "bold", display: "block", marginTop: "10px" },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "8px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginBottom: "10px",
  },
  message: { color: "red" },
  studentsContainer: { marginTop: "10px" },
  studentRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    padding: "10px",
    borderBottom: "1px solid #ddd",
  },
  studentName: { flex: 1, textAlign: "left" },
  buttonPresente: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonAusente: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonJustificado: {
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonSave: {
    marginTop: "15px",
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonPDF: {
    marginTop: "15px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  buttonResumen: {
    marginTop: "15px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    marginTop: "20px",
    borderCollapse: "collapse",
  },
  th: {
    border: "1px solid #ccc",
    padding: "8px",
    backgroundColor: "#f2f2f2",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: "8px",
  },
  paginacion: {
    marginTop: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },
  pageButton: {
    padding: "5px 10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    cursor: "pointer",
    backgroundColor: "#eee",
  },
};

export default Asistencia;
