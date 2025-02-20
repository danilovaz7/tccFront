import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';

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

function Materia() {
    const { token, user } = useTokenStore();
    let { nmMateria } = useParams();

     const [usuario, setUsuario] = useState<Usuario>();

 useEffect(() => {
        async function pegaUsuarioNav() {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const userNav = await response.json();
            setUsuario(userNav);
        }
        pegaUsuarioNav();
    }, [user?.id]);

    console.log(user)
  return (
    <div className='flex flex-col h-full justify-center items-center gap-4 '>
        <h1>Ola {usuario?.nome} </h1>
    </div>



  )
}

export default Materia
