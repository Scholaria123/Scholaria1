import React, { createContext, useContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { appfirebase } from "./firebaseconfig";

// Crear el contexto
const AuthContext = createContext();

// Hook para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // datos del usuario actual
  const [isLoggedIn, setIsLoggedIn] = useState(false); // estado de sesión
  const [loading, setLoading] = useState(true); // estado de carga de datos

  useEffect(() => {
    const auth = getAuth(appfirebase);
    const db = getFirestore(appfirebase);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // empieza a cargar

      if (firebaseUser) {
        try {
          const docRef = doc(db, "usuarios", firebaseUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const userData = docSnap.data();

            setUser({
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              rol: userData.rol || "estudiante", // por defecto 'estudiante'
              nombre_completo: userData.nombre_completo || "",
            });
            setIsLoggedIn(true);
          } else {
            console.warn("No se encontró el documento del usuario en Firestore.");
            setUser(null);
            setIsLoggedIn(false);
          }
        } catch (error) {
          console.error("Error al obtener datos del usuario:", error);
          setUser(null);
          setIsLoggedIn(false);
        }
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }

      setLoading(false); // termina de cargar
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  // Función para cerrar sesión
  const logout = async () => {
    const auth = getAuth(appfirebase);
    await signOut(auth);
    setIsLoggedIn(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
