import React, { useEffect, useState } from 'react';
import { db } from '../../database/firebaseconfig';
import { collection, getDocs, addDoc, doc, updateDoc } from 'firebase/firestore';
import './ModalRegistroCalificaciones.css';

const ModalRegistroCalificaciones = ({ onClose, onSuccess, calificacion }) => {
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
      try {
        const asignaturasSnap = await getDocs(collection(db, 'asignaturas'));
        const estudiantesSnap = await getDocs(collection(db, 'estudiantes'));
        const asignaturasData = asignaturasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const estudiantesData = estudiantesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        setAsignaturas(asignaturasData);
        setEstudiantes(estudiantesData);

        if (calificacion) {
          setAsignaturaSeleccionada(calificacion.asignaturaId || '');
          setEstudianteSeleccionado(calificacion.estudianteId || '');
          setParcial1(calificacion.parcial1 || '');
          setParcial2(calificacion.parcial2 || '');
          setParcial3(calificacion.parcial3 || '');
          setObservaciones(calificacion.observaciones || '');

          const estudiante = estudiantesData.find(e => e.id === calificacion.estudianteId);
          if (estudiante) {
            setGradoSeleccionado(estudiante.grado);
            setGrupoSeleccionado(estudiante.grupo);
          }
        }

      } catch (err) {
        console.error("Error al cargar asignaturas o estudiantes:", err);
      }
    })();
  }, [calificacion]);

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
      const datos = {
        asignaturaId: asignaturaSeleccionada,
        estudianteId: estudianteSeleccionado,
        parcial1,
        parcial2,
        parcial3,
        final,
        observaciones
      };

      if (calificacion?.id) {
        // Modo edición
        const calificacionRef = doc(db, 'calificaciones', calificacion.id);
        await updateDoc(calificacionRef, datos);
        alert('Calificación actualizada');
      } else {
        // Modo registro
        await addDoc(collection(db, 'calificaciones'), datos);
        alert('Calificación registrada');
      }

      onSuccess();  // Recarga o actualiza la vista padre
      onClose();    // Cierra el modal

    } catch (error) {
      console.error('Error al guardar calificación:', error);
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
        <h3 id="modal-title">{calificacion ? 'Editar Calificación' : 'Registrar Calificación'}</h3>

        {/* Asignatura */}
        <div className="form-group">
          <label htmlFor="select-asignatura">Asignatura:</label>
          <select
            id="select-asignatura"
            value={asignaturaSeleccionada}
            onChange={e => setAsignaturaSeleccionada(e.target.value)}
          >
            <option value="">Seleccionar</option>
            {asignaturas.map(a => (
              <option key={a.id} value={a.id}>{a.nombre}</option>
            ))}
          </select>
        </div>

        {/* Grado */}
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
              <option key={grado} value={grado}>{grado}</option>
            ))}
          </select>
        </div>

        {/* Grupo */}
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
              <option key={grupo} value={grupo}>{grupo}</option>
            ))}
          </select>
        </div>

        {/* Estudiante */}
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
              <option key={e.id} value={e.id}>{e.nombre}</option>
            ))}
          </select>
        </div>

        {/* Notas */}
        <div className="grades-group">
          <div className="form-group">
            <label htmlFor="input-parcial1">Parcial 1:</label>
            <input
              id="input-parcial1"
              type="number"
              min="0"
              max="100"
              value={parcial1}
              onChange={e => setParcial1(e.target.value)}
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
              onChange={e => setParcial2(e.target.value)}
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
              onChange={e => setParcial3(e.target.value)}
            />
          </div>
        </div>

        {/* Nota final */}
        <div className="form-group">
          <label htmlFor="input-final">Nota Final (promedio):</label>
          <input id="input-final" type="text" value={final} disabled readOnly />
        </div>

        {/* Observaciones */}
        <div className="form-group">
          <label htmlFor="textarea-observaciones">Observaciones:</label>
          <textarea
            id="textarea-observaciones"
            value={observaciones}
            onChange={e => setObservaciones(e.target.value)}
          />
        </div>

        {/* Botones */}
        <div className="button-row">
          <button className="btn-cancelar" onClick={onClose} type="button">Cerrar</button>
          <button className="btn-guardar" onClick={registrarCalificacion} type="button">
            {calificacion ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistroCalificaciones;
