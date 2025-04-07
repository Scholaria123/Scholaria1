import React, { useState, useEffect } from "react";
import { Table, Button, Image } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import { db } from "../../database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

const TablaDocente = ({ openEditModal, openDeleteModal }) => {
  const [docentes, setDocentes] = useState([]);

  useEffect(() => {
    const fetchDocentes = async () => {
      try {
        const docentesSnapshot = await getDocs(collection(db, "docentes"));
        const asignaturasSnapshot = await getDocs(collection(db, "asignaturas"));
  
        const asignaturasMap = asignaturasSnapshot.docs.reduce((acc, doc) => {
          const data = doc.data();
          acc[doc.id] = {
            docenteNombre: data.docente,
            nombreAsignatura: data.nombre,
          };
          return acc;
        }, {});
  
        const docentesList = docentesSnapshot.docs.map((doc) => {
          const data = doc.data();
          const asignatura = asignaturasMap[data.asignaturaId] || {};
  
          return {
            id: doc.id,
            titulo: data.titulo,
            direccion: data.direccion,
            telefono: data.telefono,
            imagen: data.imagen,
            docente: asignatura.docenteNombre || "Sin docente",
            asignaturaNombre: asignatura.nombreAsignatura || "Sin asignatura",
          };
        });
  
        setDocentes(docentesList);
      } catch (error) {
        console.error("❌ Error al obtener docentes:", error);
      }
    };
  
    fetchDocentes();
  }, []);
  

  return (
    <Table striped bordered hover responsive>
      <thead>
        <tr>
          <th>Imagen</th>
          <th>Docente</th>
          <th>Asignatura</th>
          <th>Título</th>
          <th>Dirección</th>
          <th>Teléfono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
  {docentes.map((docente) => (
    <tr key={docente.id}>
      <td>
        {docente.imagen ? (
          <Image src={docente.imagen} width="50" height="50" rounded />
        ) : (
          "Sin imagen"
        )}
      </td>
      <td>{docente.docente}</td> {/* ✅ Aquí va el nombre del docente */}
      <td>{docente.asignaturaNombre}</td>
      <td>{docente.titulo}</td>
      <td>{docente.direccion}</td>
      <td>{docente.telefono}</td>
      <td>
        <Button
          variant="outline-warning"
          size="sm"
          className="me-2"
          onClick={() => openEditModal(docente)}
        >
          <i className="bi bi-pencil"></i>
        </Button>
        <Button
          variant="outline-danger"
          size="sm"
          onClick={() => openDeleteModal(docente)}
        >
          <i className="bi bi-trash"></i>
        </Button>
      </td>
    </tr>
  ))}
</tbody>

    </Table>
  );
};

export default TablaDocente;
