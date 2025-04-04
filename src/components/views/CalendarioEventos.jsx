import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { format } from "date-fns";
import "./CalendarioEventos.css"; // Archivo de estilos

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

  const agregarEvento = () => {
    if (!evento.trim()) return alert("Escribe un evento válido");
    const nuevoEvento = {
      fecha: format(fechaSeleccionada, "yyyy-MM-dd"),
      titulo: evento,
      tipo: tipoEvento,
    };
    setEventos([...eventos, nuevoEvento]);
    setEvento("");
  };

  const eliminarEvento = (index) => {
    setEventos(eventos.filter((_, i) => i !== index));
  };

  const marcarDiasEnCalendario = ({ date }) => {
    const fechaStr = format(date, "yyyy-MM-dd");
    const eventosDelDia = eventos.filter((e) => e.fecha === fechaStr);
    return eventosDelDia.length > 0 ? eventosDelDia.map(e => `evento-${e.tipo}`).join(" ") : null;
  };

  return (
    <div className="calendario-container">
      <h2>Calendario de Eventos</h2>
      <Calendar onChange={handleDateChange} value={fechaSeleccionada} tileClassName={marcarDiasEnCalendario} />
      <p>Fecha seleccionada: {format(fechaSeleccionada, "yyyy-MM-dd")}</p>
      
      <input
        type="text"
        placeholder="Agregar evento"
        value={evento}
        onChange={(e) => setEvento(e.target.value)}
      />
      
      <div className="tipo-evento-container">
        <button className="btn-examen" onClick={() => setTipoEvento("examen")}>📅 Examen</button>
        <button className="btn-reunion" onClick={() => setTipoEvento("reunion")}>👨‍👩‍👧 Reunión</button>
        <button className="btn-festividad" onClick={() => setTipoEvento("festividad")}>🎉 Festividad</button>
      </div>
      
      <button onClick={agregarEvento}>Agregar Evento</button>
      
      <h3>Eventos</h3>
      <ul>
        {eventos.map((e, index) => (
          <li key={index} className={`evento-${e.tipo}`}>
            {tiposEventos[e.tipo].icono} {e.fecha}: {e.titulo}
            <button onClick={() => eliminarEvento(index)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioEventos;
