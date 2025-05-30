import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import './ModalRegistroCalificaciones.css';

const ModalRegistroCalificaciones = ({ onClose, onSuccess }) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  const [gradoSeleccionado, setGradoSeleccionado] = useState('');
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState('');
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [parcial1, setParcial1] = useState('');
  const [parcial2, setParcial2] = useState('');
  const [parcial3, setParcial3] = useState('');
  const [final, setFinal] = useState('');
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    (async () => {
      const asignaturasSnap = await getDocs(collection(db, 'asignaturas'));
      const estudiantesSnap = await getDocs(collection(db, 'estudiantes'));
      setAsignaturas(asignaturasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEstudiantes(estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    })();
  }, []);

  useEffect(() => {
    const n1 = parseFloat(parcial1);
    const n2 = parseFloat(parcial2);
    const n3 = parseFloat(parcial3);
    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      setFinal(((n1 + n2 + n3) / 3).toFixed(2));
    } else {
      setFinal('');
    }
  }, [parcial1, parcial2, parcial3]);

  const registrarCalificacion = async () => {
    if (
      !asignaturaSeleccionada ||
      !gradoSeleccionado ||
      !grupoSeleccionado ||
      !estudianteSeleccionado ||
      parcial1 === '' ||
      parcial2 === '' ||
      parcial3 === '' ||
      final === ''
    ) {
      alert('Por favor completa todos los campos');
      return;
    }

    try {
      await addDoc(collection(db, 'calificaciones'), {
        asignaturaId: asignaturaSeleccionada,
        estudianteId: estudianteSeleccionado,
        parcial1,
        parcial2,
        parcial3,
        final,
        observaciones
      });
      alert('Calificación registrada');
      onSuccess();
    } catch (error) {
      console.error('Error al registrar calificación:', error);
    }
  };

  const gradosDisponibles = [...new Set(estudiantes.map(e => e.grado))];
  const gruposDisponibles = gradoSeleccionado
    ? [...new Set(estudiantes.filter(e => e.grado === gradoSeleccionado).map(e => e.grupo))]
    : [];
  const estudiantesFiltrados = estudiantes.filter(
    e => e.grado === gradoSeleccionado && e.grupo === grupoSeleccionado
  );

 return (
  <div className="modal-overlay">
    <div className="modal-content" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <h3 id="modal-title">Registrar Calificación</h3>

      <div className="form-group">
        <label htmlFor="select-asignatura">Asignatura:</label>
        <select
          id="select-asignatura"
          value={asignaturaSeleccionada}
          onChange={e => setAsignaturaSeleccionada(e.target.value)}
        >
          <option value="">Seleccionar</option>
          {asignaturas.map(a => (
            <option key={a.id} value={a.id}>
              {a.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="select-grado">Grado:</label>
        <select
          id="select-grado"
          value={gradoSeleccionado}
          onChange={e => {
            setGradoSeleccionado(e.target.value);
            setGrupoSeleccionado('');
            setEstudianteSeleccionado('');
          }}
        >
          <option value="">Seleccionar</option>
          {gradosDisponibles.map(grado => (
            <option key={grado} value={grado}>
              {grado}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="select-grupo">Grupo:</label>
        <select
          id="select-grupo"
          value={grupoSeleccionado}
          onChange={e => {
            setGrupoSeleccionado(e.target.value);
            setEstudianteSeleccionado('');
          }}
          disabled={!gradoSeleccionado}
        >
          <option value="">Seleccionar</option>
          {gruposDisponibles.map(grupo => (
            <option key={grupo} value={grupo}>
              {grupo}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="select-estudiante">Estudiante:</label>
        <select
          id="select-estudiante"
          value={estudianteSeleccionado}
          onChange={e => setEstudianteSeleccionado(e.target.value)}
          disabled={!grupoSeleccionado}
        >
          <option value="">Seleccionar</option>
          {estudiantesFiltrados.map(e => (
            <option key={e.id} value={e.id}>
              {e.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="grades-group">
        <div className="form-group">
          <label htmlFor="input-parcial1">Parcial 1:</label>
          <input
            id="input-parcial1"
            type="number"
            min="0"
            max="100"
            value={parcial1}
            onChange={e => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setParcial1(value);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-parcial2">Parcial 2:</label>
          <input
            id="input-parcial2"
            type="number"
            min="0"
            max="100"
            value={parcial2}
            onChange={e => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setParcial2(value);
              }
            }}
          />
        </div>

        <div className="form-group">
          <label htmlFor="input-parcial3">Parcial 3:</label>
          <input
            id="input-parcial3"
            type="number"
            min="0"
            max="100"
            value={parcial3}
            onChange={e => {
              const value = e.target.value;
              if (value === '' || (Number(value) >= 0 && Number(value) <= 100)) {
                setParcial3(value);
              }
            }}
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="input-final">Nota Final (promedio):</label>
        <input
          id="input-final"
          type="text"
          value={final}
          disabled
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="textarea-observaciones">Observaciones:</label>
        <textarea
          id="textarea-observaciones"
          value={observaciones}
          onChange={e => setObservaciones(e.target.value)}
        />
      </div>

      <div className="button-row">
        <button className="btn-cancelar" onClick={onClose} type="button">
          Cerrar
        </button>
        <button className="btn-guardar" onClick={registrarCalificacion} type="button">
          Guardar
        </button>
      </div>
    </div>
  </div>
);
}

export default ModalRegistroCalificaciones;
