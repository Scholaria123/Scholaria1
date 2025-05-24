import DistribucionNotas from "./graficos/DistribucionNotas";
import EstudiantesPorGrado from "./graficos/EstudiantesPorGrado";
import DistribucionAsistencia from "./graficos/DistribucionAsistencia";

export default function Estadisticas() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Estadísticas Generales</h1>
      <DistribucionNotas />
      <EstudiantesPorGrado />
      <DistribucionAsistencia/>
    </div>
  );
}