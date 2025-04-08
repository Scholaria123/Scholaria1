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

  // Cargar asignaturas y grados únicos
  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const snapshot = await getDocs(collection(db, "asignaturas"));
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("Asignaturas:", lista); // Depuración
        setAsignaturas(lista);

        const gradosUnicos = [
          ...new Set(lista.map((a) => String(a.grado))),
        ];
        setGrados(gradosUnicos);
      } catch (error) {
        console.error("Error cargando asignaturas:", error);
      }
    };

    obtenerDatos();
  }, []);

  // Cargar estudiantes según el grado seleccionado
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
        const lista = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));
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

      {asignaturaSeleccionada && estudiantes.length === 0 && (
        <p style={styles.message}>No hay estudiantes en este grado.</p>
      )}

      <div style={styles.studentsContainer}>
        {estudiantes.map(({ id, nombre }) => (
          <div key={id} style={styles.studentRow}>
            <span style={styles.studentName}>{nombre}</span>
            <button
              style={styles.buttonPresente}
              onClick={() => marcarAsistencia(id, "Presente")}
            >
              Presente
            </button>
            <button
              style={styles.buttonAusente}
              onClick={() => marcarAsistencia(id, "Ausente")}
            >
              Ausente
            </button>
            <button
              style={styles.buttonJustificado}
              onClick={() => marcarAsistencia(id, "Justificado")}
            >
              Justificado
            </button>
          </div>
        ))}
      </div>

      <h3 style={styles.subtitle}>Resumen:</h3>
      <ul style={styles.list}>
        {Object.entries(asistencia).map(([id, estado]) => {
          const nombre = estudiantes.find((e) => e.id === id)?.nombre || "Desconocido";
          return (
            <li key={id} style={styles.listItem}>
              {nombre}: <b>{estado}</b>
            </li>
          );
        })}
      </ul>

      <button onClick={guardarAsistencia} style={styles.buttonSave}>
        Guardar Asistencia
      </button>
      <button onClick={generarPDF} style={styles.buttonPDF}>
        Generar PDF
      </button>
    </div>
  );
};

// Estilos
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    marginTop: "30px",
    padding: "20px",
    borderRadius: "15px",
    backgroundColor: "#f2f2f2",
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
  },
  studentName: { flex: 1 },
  buttonPresente: {
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
  },
  buttonAusente: {
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
  },
  buttonJustificado: {
    backgroundColor: "#ffc107",
    color: "black",
    border: "none",
    padding: "5px 8px",
    margin: "0 2px",
    borderRadius: "5px",
  },
  subtitle: { marginTop: "20px" },
  list: { padding: "0", textAlign: "left" },
  listItem: { listStyle: "none", marginBottom: "5px" },
  buttonSave: {
    marginTop: "15px",
    marginRight: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
  },
  buttonPDF: {
    marginTop: "15px",
    backgroundColor: "#17a2b8",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
  },
};

export default Asistencia;
