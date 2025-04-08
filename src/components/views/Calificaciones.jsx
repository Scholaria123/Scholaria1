import React, { useState } from 'react';
import TablaCalificaciones from '../calificaciones/TablaCalificaciones';
import ModalRegistroCalificaciones from '../calificaciones/ModalRegistroCalificaciones';
import ModalEdicionCalificaciones from '../calificaciones/ModalEdicionCalificaciones';

const Calificaciones = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalEdicion, setMostrarModalEdicion] = useState(false);
  const [calificacionEditada, setCalificacionEditada] = useState(null);
  const [actualizarTabla, setActualizarTabla] = useState(false);

  const handleRegistroExitoso = () => {
    setActualizarTabla(prev => !prev);
    setMostrarModal(false);
  };

  const handleEdicionCalificacion = (calificacion) => {
    setCalificacionEditada(calificacion);
    setMostrarModalEdicion(true);
  };
  

  const handleActualizacionExitosa = () => {
    setActualizarTabla(prev => !prev); // Esto fuerza el reload de datos
    setMostrarModalEdicion(false);
  };
  

  return (
    <div>
      <h2>Gestión de Calificaciones</h2>

      <button onClick={() => setMostrarModal(true)}>Registrar Calificación</button>

      {mostrarModal && (
        <ModalRegistroCalificaciones
          onClose={() => setMostrarModal(false)}
          onSuccess={handleRegistroExitoso}
        />
      )}
        <ModalEdicionCalificaciones
        show={mostrarModalEdicion}
        setShow={setMostrarModalEdicion}
        calificacionEditada={calificacionEditada}
        setCalificacionEditada={setCalificacionEditada}
        onCalificacionActualizada={handleActualizacionExitosa}
      />
      

<TablaCalificaciones actualizar={actualizarTabla} onEditar={handleEdicionCalificacion} />

    </div>
  );
};

export default Calificaciones;
