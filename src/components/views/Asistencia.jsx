import { useState, useEffect } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import jsPDF from "jspdf";

const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencia, setAsistencia] = useState({});
  const [fecha, setFecha] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "asignaturas"));
        const listaAsignaturas = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
          grado: doc.data().grado,
        }));

        setAsignaturas(listaAsignaturas);
        const gradosUnicos = [...new Set(listaAsignaturas.map((a) => a.grado))];
        setGrados(gradosUnicos);
      } catch (error) {
        console.error("Error obteniendo datos:", error);
      }
    };

    obtenerDatos();
  }, []);

  useEffect(() => {
    if (!gradoSeleccionado || !asignaturaSeleccionada) {
      setEstudiantes([]);
      return;
    }

    const obtenerEstudiantes = async () => {
      try {
        setEstudiantes([]);
        const estudiantesRef = collection(db, "estudiantes");
        const q = query(estudiantesRef, where("grado", "==", gradoSeleccionado));

        const querySnapshot = await getDocs(q);
        const listaEstudiantes = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre,
        }));

        setEstudiantes(listaEstudiantes);
      } catch (error) {
        console.error("Error obteniendo estudiantes:", error);
      }
    };

    obtenerEstudiantes();
  }, [gradoSeleccionado, asignaturaSeleccionada]);

  const marcarAsistencia = (nombre, estado) => {
    setAsistencia((prev) => ({
      ...prev,
      [nombre]: estado,
    }));
  };

  const generarPDF = () => {
    if (!fecha) {
      alert("Selecciona una fecha antes de generar el PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.text(`Asistencia - ${fecha}`, 10, 10);

    let y = 20;
    Object.entries(asistencia).forEach(([nombre, estado]) => {
      doc.text(`${nombre}: ${estado}`, 10, y);
      y += 10;
    });

    doc.save(`Asistencia_${fecha}.pdf`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registro de Asistencia</h2>

      <label style={styles.label}>Selecciona una fecha:</label>
      <input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} style={styles.input} />

      <label style={styles.label}>Selecciona un grado:</label>
      <select onChange={(e) => setGradoSeleccionado(e.target.value)} value={gradoSeleccionado} style={styles.select}>
        <option value="">-- Selecciona un grado --</option>
        {grados.map((grado, index) => (
          <option key={index} value={grado}>
            {grado}
          </option>
        ))}
      </select>

      {gradoSeleccionado && (
        <>
          <label style={styles.label}>Selecciona una asignatura:</label>
          <select onChange={(e) => setAsignaturaSeleccionada(e.target.value)} value={asignaturaSeleccionada} style={styles.select}>
            <option value="">-- Selecciona una asignatura --</option>
            {asignaturas
              .filter((a) => a.grado === gradoSeleccionado)
              .map(({ id, nombre }) => (
                <option key={id} value={nombre}>
                  {nombre}
                </option>
              ))}
          </select>
        </>
      )}

      {asignaturaSeleccionada && estudiantes.length === 0 && (
        <p style={styles.message}>No hay estudiantes en este grado y asignatura.</p>
      )}

      <div style={styles.studentsContainer}>
        {estudiantes.map(({ id, nombre }) => (
          <div key={id} style={styles.studentRow}>
            <span style={styles.studentName}>{nombre}</span>
            <button style={styles.buttonPresente} onClick={() => marcarAsistencia(nombre, "Presente")}>Presente</button>
            <button style={styles.buttonAusente} onClick={() => marcarAsistencia(nombre, "Ausente")}>Ausente</button>
            <button style={styles.buttonJustificado} onClick={() => marcarAsistencia(nombre, "Justificado")}>Justificado</button>
          </div>
        ))}
      </div>

      <h3 style={styles.subtitle}>Asistencia:</h3>
      <ul style={styles.list}>
        {Object.entries(asistencia).map(([nombre, estado]) => (
          <li key={nombre} style={styles.listItem}>
            {nombre}: <b>{estado}</b>
          </li>
        ))}
      </ul>

      <button onClick={generarPDF} style={styles.buttonPDF}>Generar PDF</button>
    </div>
  );
};

// Estilos CSS en línea
const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    marginTop: "50px",
    padding: "20px",
    borderRadius: "30px",
    boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  title: {
    color: "#333",
  },
  label: {
    fontWeight: "bold",
    display: "block",
    marginTop: "15px",
  },
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
    marginBottom: "12px",
  },
  message: {
    color: "#d9534f",
    fontWeight: "bold",
  },
  studentsContainer: {
    marginTop: "10px",
  },
  studentRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  },
  studentName: {
    flexGrow: 1,
  },
  buttonPresente: {
    backgroundColor: "#5cb85c",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px",
    border: "none",
    margin: "0 5px",
  },
  buttonAusente: {
    backgroundColor: "#d9534f",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px",
    border: "none",
    margin: "0 5px",
  },
  buttonJustificado: {
    backgroundColor: "#f0ad4e",
    color: "white",
    padding: "5px 10px",
    borderRadius: "10px",
    border: "none",
    margin: "0 5px",
  },
  subtitle: {
    marginTop: "20px",
  },
  list: {
    textAlign: "left",
    padding: "0",
  },
  listItem: {
    listStyle: "none",
  },
  buttonPDF: {
    marginTop: "15px",
    padding: "10px",
    backgroundColor: "#0275d8",
    color: "white",
    border: "none",
    borderRadius: "5px",
  },
};

export default Asistencia;
