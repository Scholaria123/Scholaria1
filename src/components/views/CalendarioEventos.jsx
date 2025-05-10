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

// Iconos de lucide-react
import {
  CalendarDays,
  Users2,
  PartyPopper,
  Trash2,
  Plus,
  Megaphone,
} from "lucide-react";

const CalendarioEventos = () => {
  const { user } = useAuth();
  const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date());
  const [evento, setEvento] = useState("");
  const [tipoEvento, setTipoEvento] = useState("");
  const [eventos, setEventos] = useState([]);

  const tiposEventos = {
    examen: { icono: <CalendarDays size={16} />, color: "#ffcc00" },
    reunion: { icono: <Users2 size={16} />, color: "#6c60b5" },
    festividad: { icono: <PartyPopper size={16} />, color: "#28a745" },
    anuncio: { icono: <Megaphone size={16} />, color: "#0d6efd" }, // Nuevo tipo
  };

  const handleDateChange = (date) => {
    setFechaSeleccionada(date);
  };

  const agregarEvento = async () => {
    if (!evento.trim()) return alert("Escribe un evento válido");

    const nuevoEvento = {
      fecha: format(fechaSeleccionada, "dd/MM/yyyy"),
      titulo: evento,
      tipo: tipoEvento || "anuncio",
      descripcion: evento,
    };

    try {
      const docRef = await addDoc(collection(db, "eventos"), nuevoEvento);
      setEventos((prev) => [...prev, { id: docRef.id, ...nuevoEvento }]);
      setEvento("");
      setTipoEvento("");
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

  const isAdmin = user?.rol === "admin";

  return (
    <div className="calendario-container">
      <h2><CalendarDays size={24} /> Calendario de Eventos</h2>

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
            placeholder="Escribe un evento o anuncio..."
            value={evento}
            onChange={(e) => setEvento(e.target.value)}
          />

          <div className="tipo-evento-container">
            <button className="btn-examen" onClick={() => setTipoEvento("examen")}>
              <CalendarDays size={16} /> Examen
            </button>
            <button className="btn-reunion" onClick={() => setTipoEvento("reunion")}>
              <Users2 size={16} /> Reunión
            </button>
            <button className="btn-festividad" onClick={() => setTipoEvento("festividad")}>
              <PartyPopper size={16} /> Festividad
            </button>
          </div>

          <button className="btn-agregar" onClick={agregarEvento}>
            <Plus size={16} /> Agregar Evento
          </button>
        </div>
      )}

      <h3>Eventos Agregados</h3>
      <ul className="lista-eventos">
        {eventos.map((e) => (
          <li key={e.id} className={`evento-${e.tipo}`}>
            {tiposEventos[e.tipo]?.icono || <Megaphone size={16} />} {e.fecha}: {e.titulo}

            {isAdmin && (
              <button
                onClick={() => eliminarEvento(e.id)}
                className="btn-eliminar"
              >
                <Trash2 size={16} />
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CalendarioEventos;
