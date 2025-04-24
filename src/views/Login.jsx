
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button } from "react-bootstrap";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { appfirebase } from "../database/firebaseconfig";



import "../App.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = registro
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [rol, setRol] = useState("estudiante");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const auth = getAuth(appfirebase);
  const db = getFirestore(appfirebase);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Verificar si tiene rol en Firestore
      const docRef = doc(db, "usuarios", uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        console.log("Rol:", userData.rol);
        navigate("/inicio");
      } else {
        setError("No se encontró información del usuario.");
      }
    } catch (error) {
      console.error(error);
      setError("Credenciales incorrectas.");
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // Guardar información adicional en Firestore
      await setDoc(doc(db, "usuarios", uid), {
        email,
        nombre_completo: nombreCompleto,
        rol,
      });

      console.log("Usuario registrado con éxito");
      navigate("/inicio");
    } catch (error) {
      console.error(error);
      setError("Error al registrar el usuario.");
    }
  };

  return (
    <Container className="d-flex vh-100 justify-content-center align-items-center">
      <div style={{ width: "100%", maxWidth: 400 }}>
        <h3 className="text-center">{isLogin ? "Iniciar sesión" : "Registrarse"}</h3>

        <Form onSubmit={isLogin ? handleLogin : handleRegister}>
          <Form.Group className="mb-3">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Form.Group>

          {!isLogin && (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control type="text" value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3">
              <Form.Label>Rol</Form.Label>
              <Form.Select value={rol} onChange={(e) => setRol(e.target.value)}>
              <option value="estudiante">Estudiante</option>
              <option value="docente">Docente</option>
              <option value="padre">Padre</option> {/* <- nuevo rol agregado */}
              </Form.Select>
              </Form.Group>

            </>
          )}

          {error && <p className="text-danger">{error}</p>}

          <Button variant="primary" type="submit" className="w-100">
            {isLogin ? "Ingresar" : "Registrarse"}
          </Button>
        </Form>

        <div className="text-center mt-3">
          <Button variant="link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default Login;