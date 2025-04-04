import React, { useState } from 'react';
import TablaCalificaciones from '../calificaciones/TablaCalificaciones';
import ModalRegistroCalificaciones from '../calificaciones/ModalRegistroCalificaciones';

const Calificaciones = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [actualizarTabla, setActualizarTabla] = useState(false);

  const handleRegistroExitoso = () => {
    setActualizarTabla(prev => !prev); // fuerza actualización de la tabla
    setMostrarModal(false); // cierra el modal
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

      <TablaCalificaciones actualizar={actualizarTabla} />
    </div>
  );
};

export default Calificaciones;
