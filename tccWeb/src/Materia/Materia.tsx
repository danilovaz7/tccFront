import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { NavLink, useNavigate, useParams } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';

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
    const [inicioPerguntas, setInicioPerguntas] = useState(false)
    const [contagem, setContagem] = useState(0);
    const [perguntaNum, setPerguntaNum] = useState(0);

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

    function iniciarJogo() {
        setContagem(5);
        const intervalo = setInterval(() => {
            setContagem((prev) => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    setInicioPerguntas(true);
                    return 0;
                } else {
                    return prev - 1;
                }
            });
        }, 1000);
    }

    return (
        <div className='flex text-center flex-col h-full justify-start items-center gap-20'>
            <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />
            {
                inicioPerguntas
                    ?
                    <div className=' w-[90%]  mb-12.5 p-10 flex flex-col justify-center items-center gap-4 border-2 border-red-400 '>
                        <h1 className='text-2xl'>{perguntaNum}/12</h1>
                        <div className=' w-[100%] h-fit p-10 flex flex-col  justify-center items-center gap-4 border-2 border-blue-500 '>
                            <p className='text-2xl'>E</p>
                        </div>
                        <div className='w-[90%] p-5 flex flex-wrap justify-center items-center gap-5  border-2 border-green-500 '>
                            <div onClick={() => { setPerguntaNum(perguntaNum + 1) }} className='w-[45%] p-5 flex justify-start items-center gap-4 border-2 border-green-500 '>
                                <p>Alameda do paraiso</p>
                            </div>
                            <div className='w-[45%] p-5 flex justify-start items-center gap-4 border-2 border-green-500 '>
                                <p>Bootcamp na australia aaaaaaaaa aaaaaaaaa</p>
                            </div>
                            <div className='w-[45%] p-5 flex justify-start items-center gap-4 border-2 border-green-500 '>
                                <p>Episodio perdido do bob esponja</p>
                            </div>
                            <div className='w-[45%] p-5 flex justify-start items-center gap-4 border-2 border-green-500 '>
                                <p>Uma familia da Pesada</p>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        {
                            contagem > 0
                                ?
                                <>
                                    <h1 className='text-4xl'>Ola {usuario?.nome}, vamos treinar {nmMateria}? </h1>
                                    <p className='text-7xl'>{contagem}...</p>
                                </>
                                :
                                <>
                                    <h1 className='text-4xl'>Ola {usuario?.nome}, vamos treinar {nmMateria}? </h1>
                                    <button onClick={() => { iniciarJogo() }} className="bg-cyan-400 text-black p-4 rounded-md">Iniciar jogo!</button>
                                </>
                        }
                    </>
            }
        </div>
    )
}

export default Materia
