import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getDocs,
  collection,
  query,
  where,
  setDoc,
  doc,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../database/firebaseconfig";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import ScholariaLogo from "../assets/imagenes/Scholaria_logo.png";
import { useAuth } from "../database/authcontext"; // ✅ NUEVO

const Login = () => {
  const [identificador, setIdentificador] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth(); // ✅ NUEVO

  useEffect(() => {
    if (user) {
      navigate("/inicio"); // ✅ NUEVO: puedes cambiar a "/seleccionarHijo" si prefieres
    }
  }, [user, navigate]); // ✅ NUEVO

  const handleLoginOrRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (!identificador.includes("@")) {
        // Login de docente por carnet
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
        if (!identificador.includes("@") || !identificador.includes(".")) {
          setError("Debes ingresar un correo electrónico válido.");
          return;
        }

        if (password.length < 6) {
          setError("La contraseña debe tener al menos 6 caracteres.");
          return;
        }

        if (password !== confirmPassword) {
          setError("Las contraseñas no coinciden.");
          return;
        }

        try {
          const userCredential = await createUserWithEmailAndPassword(auth, identificador, password);
          const user = userCredential.user;

          await setDoc(doc(db, "usuarios", user.uid), {
            email: identificador,
            rol: "padre",
            nombre_completo: nombreCompleto,
            creado: new Date(),
          });

          navigate("/seleccionarHijo");
        } catch (error) {
          switch (error.code) {
            case "auth/email-already-in-use":
              setError("Este correo ya está registrado.");
              break;
            case "auth/invalid-email":
              setError("El correo no es válido.");
              break;
            case "auth/weak-password":
              setError("La contraseña es muy débil. Usa al menos 6 caracteres.");
              break;
            default:
              setError("Ocurrió un error al registrar. Intenta nuevamente.");
          }
        }

        return;
      }

      // Login de padre (correo y contraseña)
      await signInWithEmailAndPassword(auth, identificador, password);
      navigate("/seleccionarHijo");
    } catch (error) {
      setError("Credenciales incorrectas o usuario no registrado.");
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
