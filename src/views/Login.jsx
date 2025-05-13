import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDocs, collection, query, where } from "firebase/firestore";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../database/firebaseconfig";
import { Form, Button, Alert, Card } from "react-bootstrap";
import "./Login.css";
import ScholariaLogo from "../assets/imagenes/Scholaria_logo.png";

const Login = () => {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!identificador.includes("@")) {
        // Es un docente → buscar por carnet
        const q = query(collection(db, "docentes"), where("carnet", "==", identificador));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          navigate(`/logindocente/${identificador}`);
        } else {
          setError("Carnet no encontrado.");
        }
        return;
      }

      // Si contiene @, es un login con correo
      const userCredential = await signInWithEmailAndPassword(auth, identificador, password);
      navigate("/inicio");
    } catch (err) {
      console.error(err);
      setError("Credenciales incorrectas o usuario no registrado.");
    }
  };

  return (
  <div className="login-container">
    <div className="login-card">
      <img src={ScholariaLogo} alt="Scholaria logo" className="login-logo" />
      <h3 className="login-title">Iniciar sesión</h3>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form onSubmit={handleLogin}>
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

        {identificador.includes("@") && (
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
        )}

        <Button variant="primary" type="submit" className="w-100 login-button">
          Iniciar sesión
        </Button>
      </Form>
    </div>
  </div>
);

}

export default Login;
