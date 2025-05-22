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
    const cargarDatos = async () => {
      const asignaturasSnap = await getDocs(collection(db, 'asignaturas'));
      const estudiantesSnap = await getDocs(collection(db, 'estudiantes'));

      setAsignaturas(asignaturasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setEstudiantes(estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    cargarDatos();
  }, []);

  useEffect(() => {
    const n1 = parseFloat(parcial1);
    const n2 = parseFloat(parcial2);
    const n3 = parseFloat(parcial3);

    if (!isNaN(n1) && !isNaN(n2) && !isNaN(n3)) {
      const promedio = ((n1 + n2 + n3) / 3).toFixed(2);
      setFinal(promedio);
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
      <div className="modal-content">
        <h3>Registrar Calificación</h3>

        <div className="form-group">
          <label>Asignatura:</label>
          <select
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
          <label>Grado:</label>
          <select
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
          <label>Grupo:</label>
          <select
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
          <label>Estudiante:</label>
          <select
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

        <div style={styles.gradesGroup}>
  <div style={styles.formGroup}>
    <label>Parcial 1:</label>
    <input
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

  <div style={styles.formGroup}>
    <label>Parcial 2:</label>
    <input
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

  <div style={styles.formGroup}>
    <label>Parcial 3:</label>
    <input
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
          <label>Nota Final (promedio):</label>
          <input type="text" value={final} disabled />
        </div>

        <div className="form-group">
          <label>Observaciones:</label>
          <textarea value={observaciones} onChange={e => setObservaciones(e.target.value)} />
        </div>

        <div className="button-row">
          <button className="btn-cancelar" onClick={onClose}>
            Cerrar
          </button>
          <button className="btn-guardar" onClick={registrarCalificacion}>
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistroCalificaciones;
