import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebaseconfig";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#4f46e5", "#10b981", "#facc15"]; 

export default function DistribucionAsistencia() {
  const [data, setData] = useState([
    { name: "Presente", value: 0 },
    { name: "Ausente", value: 0 },
    { name: "Justificado", value: 0 },
  ]);

  useEffect(() => {
    const fetchAsistencia = async () => {
      const snap = await getDocs(collection(db, "asistencia"));
      const counts = { Presente: 0, Ausente: 0, Justificado: 0 };

      snap.docs.forEach((doc) => {
        const estado = doc.data().estado;
        if (estado === "Presente") counts.Presente++;
        else if (estado === "Ausente") counts.Ausente++;
        else if (estado === "Justificado") counts.Justificado++;
      });

      setData([
        { name: "Presente", value: counts.Presente },
        { name: "Ausente", value: counts.Ausente },
        { name: "Justificado", value: counts.Justificado },
      ]);
      console.log("Datos de asistencia:", counts);
    };

    fetchAsistencia();
  }, []);

  return (
    <div
      style={{
        width: "100%",
        height: 400,
        padding: 16,
        backgroundColor: "white",
        borderRadius: 16,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      }}
    >
      <h2 style={{ fontWeight: "bold", fontSize: "1.25rem", marginBottom: 16 }}>
        Distribución de Asistencia
      </h2>
      <ResponsiveContainer width="100%" height="85%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={120}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
