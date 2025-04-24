import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useTokenStore } from "../hooks/useTokenStore";
import { Outlet } from "react-router";
import { useParams, useNavigate } from 'react-router';

interface Usuario {
    id: number,
    nome: string,
    nivel: string,
    tipo_usuario_id: number,
    id_turma: number,
    id_escola: number
    avatar: {
        nome: string,
        caminho: string
    }
}

export function RootLayout() {

    const [usuario, setUsuario] = useState<Usuario>();
    const { token, user } = useTokenStore();
    const navigate = useNavigate();

    if (usuario === null) {
        return <div>Carregando usuário…</div>;
        // ou: return <Navigate to="/home" replace />;
      }

    useEffect(() => {
        async function pegaUsuarios() {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const usuarioAtual = await response.json();
            setUsuario(usuarioAtual);
        }
        pegaUsuarios();
    }, [user, token]);

    return (
        <div className=" overflow-x-hidden w-screen flex flex-col justify-start items-center h-screen gap-12">
            <Navbar
  id={usuario?.id}
  nivel={usuario?.nivel}
  avatar={usuario?.avatar?.caminho ?? ""}
/>

            <Outlet/>
        </div>
    );
}