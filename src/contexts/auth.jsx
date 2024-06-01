import { useState, useEffect, createContext } from "react";
import { auth, db } from "../services/firebasConnection";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

// eslint-disable-next-line react/prop-types
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadUser() {
      const storageUser = localStorage.getItem("@crConsole");

      if (storageUser) {
        setUser(JSON.parse(storageUser));
        setLoading(false);
      }
      setLoading(false);
    }
    loadUser();
  }, []);

  async function signIn(email, password) {
    setLoadingAuth(true);

    await signInWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        let data = {
          uid: uid,
          nome: docSnap.data()?.nome,
          email: value.user.email,
          avatarUrl: docSnap.data()?.avatarUrl,
        };

        console.log(data);
        setUser(data);
        storageUser(data);
        setLoadingAuth(false);
        toast.success("Bem vindo(a) de volta", {
          position: "bottom-center"
        });
        navigate("/dashboard");
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
        toast.error("Usuário ou senha errados, confira seus dados!", {
          position: "bottom-center",
          className: "text-gray900-500"
        });
      });
  }

  //Cadastrar novo usuário
  async function signUp(email, password, name) {
    setLoadingAuth(true);
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (value) => {
        let uid = value.user.uid;

        await setDoc(doc(db, "users", uid), {
          nome: name,
          avatarUrl: null,
        }).then(() => {
          let data = {
            uid: uid,
            nome: name,
            email: value.user.email,
            avatarUrl: null,
          };

          setUser(data);
          storageUser(data);
          setLoadingAuth(false);
          toast.success("Seja bem vindo ao nosso sistema");
          navigate("/dashboard");
        });
      })
      .catch((error) => {
        console.log(error);
        setLoadingAuth(false);
      });
  }

  function storageUser(data) {
    localStorage.setItem("@crConsole", JSON.stringify(data));
  }

  async function logout() {
    await signOut(auth);
    localStorage.removeItem("@crConsole");
    setUser(null);
  }

  async function restorePassword(email) {
    setLoadingAuth(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast.success("Email de recuperação enviado com sucesso");
        navigate("/");
        setLoadingAuth(false);
      })
      .catch((error) => {
        toast.error("Algo deu errado, por favor, verifique o email digitado");
        setLoadingAuth(false);
        console.log(error);
      });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user, //boolean
        user,
        signIn,
        signUp,
        loadingAuth,
        loading,
        logout,
        storageUser,
        setUser,
        restorePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
