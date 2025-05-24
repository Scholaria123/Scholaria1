import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebaseconfig";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
} from "recharts";

export default function EstudiantesPorGrado() {
  const [data, setData] = useState(null); 

  useEffect(() => {
    const fetchEstudiantes = async () => {
      const snap = await getDocs(collection(db, "estudiantes"));
      console.log("📄 Documentos cargados:", snap.size);

      const counts = {};
      snap.docs.forEach(doc => {
        const estudiante = doc.data();
        console.log("👤 Estudiante:", estudiante);
        if (!estudiante.eliminado) {
          const grado = estudiante.grado || "Sin grado";
          counts[grado] = (counts[grado] || 0) + 1;
        }
      });

      const chartData = Object.entries(counts).map(([grado, cantidad]) => ({ grado, cantidad }));
      console.log("📊 Datos para gráfico:", chartData);

      setData(chartData.length ? chartData : null);
    };

    fetchEstudiantes();
  }, []);

  if (data === null) return <p>No hay datos para mostrar</p>;

  return (
    <div style={{ width: "100%", height: 400, backgroundColor: "white", padding: 20, borderRadius: 10, boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
      <h2>Estudiantes por Grado</h2>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="grado" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#0bcd0e" name="Cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}