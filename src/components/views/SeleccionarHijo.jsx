import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db, auth } from "../../database/firebaseconfig";
import { Button, Card, Form, Spinner } from "react-bootstrap";

const SeleccionarHijo = () => {
  const [estudiantes, setEstudiantes] = useState([]);
  const [seleccionado, setSeleccionado] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verificarHijoAsignado = async () => {
      const padreId = auth.currentUser?.uid;
      if (!padreId) return;

      // Buscar si ya tiene un estudiante asignado
      const q = query(collection(db, "estudiantes"), where("padreId", "==", padreId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const hijo = snapshot.docs[0];
        navigate(`/calificaciones/${hijo.id}`);
      } else {
        // Mostrar estudiantes disponibles si no tiene hijos vinculados
        const allEstudiantes = await getDocs(collection(db, "estudiantes"));
        setEstudiantes(allEstudiantes.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }
    };

    verificarHijoAsignado();
  }, [navigate]);

  const handleSeleccionar = async () => {
    if (!seleccionado) return;

    const padreId = auth.currentUser?.uid;
    if (!padreId) return;

    await updateDoc(doc(db, "estudiantes", seleccionado), {
      padreId: padreId,
    });

    navigate(`/calificaciones/${seleccionado}`);
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <Card className="container mt-5 p-4">
      <h4>Selecciona a tu hijo</h4>
      <Form.Select
        value={seleccionado}
        onChange={(e) => setSeleccionado(e.target.value)}
        className="mb-3"
      >
        <option value="">-- Selecciona un estudiante --</option>
        {estudiantes.map(est => (
          <option key={est.id} value={est.id}>
            {est.nombre}
          </option>
        ))}
      </Form.Select>
      <Button onClick={handleSeleccionar} disabled={!seleccionado}>
        Confirmar y ver calificaciones
      </Button>
    </Card>
  );
};

export default SeleccionarHijo;
