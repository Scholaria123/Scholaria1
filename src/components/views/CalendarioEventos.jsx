import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { db } from "../../database/firebaseconfig";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import "./CalendarioEventos.css";
import { useAuth } from "../../database/authcontext"; 

const CalendarioEventos = () => {
  const { user } = useAuth(); // 👈 Cambio aquí (antes decía currentUser)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [evento, setEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("examen");
  const [eventos, setEventos] = useState([]);

  const tiposEventos = {
    examen: { icono: "📅", color: "#ffcc00" },
    reunion: { icono: "👨‍👩‍👧", color: "#6c60b5" },
    festividad: { icono: "🎉", color: "#28a745" },
  };

  const handleDateChange = (date) => {
    setFechaSeleccionada(date);
  };

  const agregarEvento = async () => {
    if (!evento.trim()) return alert("Escribe un evento válido");

    const nuevoEvento = {
      fecha: format(fechaSeleccionada, "dd/MM/yyyy"),
      titulo: evento,
      tipo: tipoEvento,
      descripcion: evento,
    };

    try {
      const docRef = await addDoc(collection(db, "eventos"), nuevoEvento);
      setEventos((prev) => [...prev, { id: docRef.id, ...nuevoEvento }]);
      setEvento("");
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      alert("Hubo un error al guardar el evento.");
    }
  };

  const eliminarEvento = async (id) => {
    try {
      await deleteDoc(doc(db, "eventos", id));
      setEventos((prev) => prev.filter((e) => e.id !== id));
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
      alert("No se pudo eliminar el evento.");
    }
  };

  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "eventos"));
        const eventosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEventos(eventosData);
      } catch (error) {
        console.error("Error cargando los eventos:", error);
      }
    };

    cargarEventos();
  }, []);

  const marcarDiasEnCalendario = ({ date }) => {
    const fechaStr = format(date, "dd/MM/yyyy");
    const eventosDelDia = eventos.filter((e) => e.fecha === fechaStr);
    return eventosDelDia.length > 0
      ? eventosDelDia.map((e) => `evento-${e.tipo}`).join(" ")
      : null;
  };

  const isAdmin = user?.rol === "admin"; // 👈 Cambio aquí (antes decía currentUser)

  return (
    <div className="calendario-container">
      <h2>📆 Calendario de Eventos</h2>

      <div className="calendar-wrapper">
        <Calendar
          onChange={handleDateChange}
          value={fechaSeleccionada}
          tileClassName={marcarDiasEnCalendario}
        />
      </div>

      <p className="fecha-seleccionada">
        Fecha seleccionada: <strong>{format(fechaSeleccionada, "dd/MM/yyyy")}</strong>
      </p>

      {isAdmin && (
        <div className="formulario-evento">
          <input
            type="text"
            placeholder="Escribe un evento..."
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
          />

          <div className="tipo-evento-container">
            <button className="btn-examen" onClick={() => setTipoEvento("examen")}>
              📅 Examen
            </button>
            <button className="btn-reunion" onClick={() => setTipoEvento("reunion")}>
              👨‍👩‍👧 Reunión
            </button>
            <button className="btn-festividad" onClick={() => setTipoEvento("festividad")}>
              🎉 Festividad
            </button>
          </div>

          <button className="btn-agregar" onClick={agregarEvento}>
            ➕ Agregar Evento
          </button>
        </div>
      )}

      <h3>Eventos Agregados</h3>
      <ul className="lista-eventos">
        {eventos.map((e) => (
          <li key={e.id} className={`evento-${e.tipo}`}>
            {tiposEventos[e.tipo]?.icono || "🗓️"} {e.fecha}: {e.titulo}

            {isAdmin && (
              <button
                onClick={() => eliminarEvento(e.id)}
                className="btn-eliminar"
              >
                ❌
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioEventos;