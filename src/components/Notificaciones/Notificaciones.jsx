import { useEffect, useState } from "react";
import { db } from "../../database/firebaseconfig";
import { collection, onSnapshot } from "firebase/firestore";
import "./Notificaciones.css";

const Notificaciones = () => {
  const [eventos, setEventos] = useState([]);

  const tiposEventos = {
    examen: { icono: "📅", color: "#ffcc00" },
    reunion: { icono: "👨‍👩‍👧", color: "#6c60b5" },
    festividad: { icono: "🎉", color: "#28a745" },
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

    // Limpiar el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <div className="notificaciones-container">
      <h2>🔔 Notificaciones</h2>
      <ul className="notificaciones-lista">
        {eventos.map((evento) => (
          <li
            key={evento.id}
            className="notificacion-item"
            style={{
              backgroundColor: tiposEventos[evento.tipo]?.color || "#e0e0e0",
            }}
          >
            <div className="notificacion-icono">
              {tiposEventos[evento.tipo]?.icono || "🗓️"}
            </div>
            <div className="notificacion-detalles">
              <strong>{evento.titulo}</strong>
              <p>📅 {evento.fecha}</p>
              <p>{evento.descripcion}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notificaciones;
