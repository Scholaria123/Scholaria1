import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../database/firebaseconfig";
import TablaCalificaciones from "../calificaciones/TablaCalificaciones";

const CalificacionesHijo = () => {
  const { estudianteId } = useParams();
  const [calificaciones, setCalificaciones] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  useEffect(() => {
    const unsubAsignaturas = onSnapshot(collection(db, "asignaturas"), (snapshot) => {
      setAsignaturas(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubEstudiantes = onSnapshot(collection(db, "estudiantes"), (snapshot) => {
      setEstudiantes(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    const unsubCalificaciones = onSnapshot(collection(db, "calificaciones"), (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(c => c.estudianteId === estudianteId);
      setCalificaciones(data);
    });

    return () => {
      unsubAsignaturas();
      unsubEstudiantes();
      unsubCalificaciones();
    };
  }, [estudianteId]);

  return (
    <div className="container mt-5">
      <h3>Calificaciones de tu hijo</h3>
      <TablaCalificaciones
        calificaciones={calificaciones}
        asignaturas={asignaturas}
        estudiantes={estudiantes}
        soloLectura
      />
    </div>
  );
};

export default CalificacionesHijo;
