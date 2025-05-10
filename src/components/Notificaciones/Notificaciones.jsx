import { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, onSnapshot } from "firebase/firestore";
import "./Notificaciones.css";
import {
  CalendarDays,
  Users2,
  PartyPopper,
  Bell,
  CheckCircle,
} from "lucide-react";

const Notificaciones = () => {
  const [eventos, setEventos] = useState([]);
  const [leidas, setLeidas] = useState(new Set());

  const tiposEventos = {
    examen: { icono: <CalendarDays size={20} />, color: "#ffcc00" },
    reunion: { icono: <Users2 size={20} />, color: "#6c60b5" },
    festividad: { icono: <PartyPopper size={20} />, color: "#28a745" },
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "eventos"),
      (snapshot) => {
        const datos = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEventos(datos);
      },
      (error) => {
        console.error("Error al escuchar eventos:", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const marcarTodasComoLeidas = () => {
    const todosLosIds = eventos.map((e) => e.id);
    setLeidas(new Set(todosLosIds));
  };

  return (
    <div className="notificaciones-container">
      <div className="notificaciones-header">
        <h2>
          <Bell size={24} style={{ marginRight: "8px" }} />
          Notificaciones
        </h2>
      </div>

      <ul className="notificaciones-lista">
        {eventos.map((evento) => {
          const estaLeida = leidas.has(evento.id);
          return (
            <li
              key={evento.id}
              className="notificacion-item"
              style={{
                backgroundColor: tiposEventos[evento.tipo]?.color || "#e0e0e0",
                opacity: estaLeida ? 0.5 : 1,
              }}
            >
              <div className="notificacion-icono">
                {tiposEventos[evento.tipo]?.icono || <CalendarDays size={20} />}
              </div>
              <div className="notificacion-detalles">
                <strong>{evento.titulo}</strong>
                <p>{evento.fecha}</p>
                {evento.descripcion !== evento.titulo && (
                  <p>{evento.descripcion}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Botón al final */}
      {eventos.length > 0 && (
        <div className="notificaciones-footer">
          <button className="btn-marcar-todas" onClick={marcarTodasComoLeidas}>
            <CheckCircle size={18} style={{ marginRight: "8px" }} />
            Marcar todas como leídas
          </button>
        </div>
      )}
    </div>
  );
};

export default Notificaciones;
