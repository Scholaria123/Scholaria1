import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import { db } from "../../database/firebaseconfig";
import { collection, addDoc, getDocs } from "firebase/firestore";
import "./CalendarioEventos.css";

const CalendarioEventos = () => {
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
      await addDoc(collection(db, "eventos"), nuevoEvento);
      setEventos((prev) => [...prev, nuevoEvento]);
      setEvento("");
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      alert("Hubo un error al guardar el evento.");
    }
  };

  // ✅ Cargar eventos al iniciar
  useEffect(() => {
    const cargarEventos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "eventos"));
        const eventosData = querySnapshot.docs.map((doc) => doc.data());
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

  return (
    <div className="calendario-container">
      <h2>Calendario de Eventos</h2>

      <Calendar
        onChange={handleDateChange}
        value={fechaSeleccionada}
        tileClassName={marcarDiasEnCalendario}
      />

      <p>Fecha seleccionada: {format(fechaSeleccionada, "dd/MM/yyyy")}</p>

      <input
        type="text"
        placeholder="Agregar evento"
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

      <button onClick={agregarEvento}>Agregar Evento</button>

      <h3>Eventos agregados</h3>
      <ul>
        {eventos.map((e, index) => (
          <li key={index} className={`evento-${e.tipo}`}>
            {tiposEventos[e.tipo]?.icono || "🗓️"} {e.fecha}: {e.titulo}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioEventos;
