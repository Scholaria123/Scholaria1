import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../../database/firebaseconfig";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer,
} from "recharts";

export default function DistribucionNotas() {
  const [data, setData] = useState([
    { rango: "0-59", cantidad: 0 },
    { rango: "60-69", cantidad: 0 },
    { rango: "70-79", cantidad: 0 },
    { rango: "80-89", cantidad: 0 },
    { rango: "90-100", cantidad: 0 },
  ]);

  useEffect(() => {
    const fetchCalificaciones = async () => {
      const snap = await getDocs(collection(db, "calificaciones"));
      console.log("📄 Documentos cargados:", snap.size);

      const nuevaData = [
        { rango: "0-59", cantidad: 0 },
        { rango: "60-69", cantidad: 0 },
        { rango: "70-79", cantidad: 0 },
        { rango: "80-89", cantidad: 0 },
        { rango: "90-100", cantidad: 0 },
      ];

      snap.docs.forEach((doc, index) => {
        const nota = doc.data().final;
        console.log(`📘 Doc ${index + 1} - Final:`, nota);

        if (nota < 60) nuevaData[0].cantidad++;
        else if (nota < 70) nuevaData[1].cantidad++;
        else if (nota < 80) nuevaData[2].cantidad++;
        else if (nota < 90) nuevaData[3].cantidad++;
        else nuevaData[4].cantidad++;
      });

      console.log("📊 Datos procesados para el gráfico:", nuevaData);
      setData(nuevaData);
    };

    fetchCalificaciones();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow" style={{ height: 400 }}>
      <h2 className="text-xl font-bold mb-4 text-red-500">Distribución de Notas Finales</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="rango" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="cantidad" fill="#4f46e5" name="Cantidad" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
