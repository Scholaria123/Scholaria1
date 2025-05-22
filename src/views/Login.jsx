import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where, addDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../database/firebaseconfig";
import { setDoc, doc } from "firebase/firestore";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import ScholariaLogo from "../assets/imagenes/Scholaria_logo.png";

const Login = () => {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!identificador.includes("@")) {
        // Es un docente (login con carnet)
        const q = query(collection(db, "docentes"), where("carnet", "==", identificador));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          navigate(`/logindocente/${identificador}`);
        } else {
          setError("Carnet no encontrado.");
        }
        return;
      }

      if (isRegistering) {
        // Registro como padre
        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden.");
          return;
        }


          const userCredential = await createUserWithEmailAndPassword(auth, identificador, password);
const user = userCredential.user;

// Crear el documento en Firestore con el UID como ID
await setDoc(doc(db, "usuarios", user.uid), {
  email: identificador,
  rol: "padre",
  nombre_completo: nombreCompleto,
  creado: new Date()
});

      
        navigate("/inicioPadre");
      } else {
        // Inicio de sesión normal
        const userCredential = await signInWithEmailAndPassword(auth, identificador, password);
        const uid = userCredential.user.uid;

        // Buscar rol del usuario en Firestore
        const q = query(collection(db, "usuarios"), where("email", "==", identificador));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          if (data.rol === "padre") {
            navigate("/inicio");
          } else {
            navigate("/inicio");
          }
        } else {
          navigate("/inicio"); // fallback
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error en la autenticación. Verifica los datos.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={ScholariaLogo} alt="Scholaria logo" className="login-logo" />
        <h3 className="login-title">
          {isRegistering ? "Registrarse como padre" : "Iniciar sesión"}
        </h3>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLoginOrRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Email o carnet:</Form.Label>
            <Form.Control
              type="text"
              value={identificador}
              onChange={(e) => setIdentificador(e.target.value)}
              placeholder="Correo o carnet"
              required
            />
          </Form.Group>

          {(identificador.includes("@") || isRegistering) && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Contraseña:</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
              </Form.Group>

              {isRegistering && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirmar contraseña:</Form.Label>
                    <Form.Control
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirmar contraseña"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Nombre completo:</Form.Label>
                    <Form.Control
                      type="text"
                      value={nombreCompleto}
                      onChange={(e) => setNombreCompleto(e.target.value)}
                      placeholder="Ej. María Pérez"
                      required
                    />
                  </Form.Group>
                </>
              )}
            </>
          )}

          <Button variant="primary" type="submit" className="w-100 login-button">
            {isRegistering ? "Registrarse" : "Iniciar sesión"}
          </Button>
        </Form>

        <div className="mt-3 text-center">
          <Button variant="link" onClick={() => setIsRegistering(!isRegistering)}>
            {isRegistering
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿Primera vez? Regístrate como padre"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
