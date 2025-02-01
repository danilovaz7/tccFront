import { FormEvent, useState } from 'react';
import './HomePage.css'
import { MdMenu } from "react-icons/md";

export function HomePage() {

    const [matricula, setMatricula] = useState('')

    function formSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        alert(matricula)
    }


    return (
        <div className='containerHome'>
            <div className='nav'>
                <div className='menuIcon'>
                    <MdMenu size={40} className='menu' />
                </div>

                <div className='logoIcon'>
                    <img src="./src/assets/logo1Play2Learn.png" alt="" />
                </div>

                <div className='perfilContainer'>
                    <div className='perfil'>
                        <p>Nível 10</p>
                        <img className='imgPerfil' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                    </div>
                </div>
            </div>

            <div className='page'>
                <div className='left'>
                    <h1>Que tal jogar com um amigo?</h1>
                    <p>É sempre melhor evoluir juntos!</p>
                    <form onSubmit={(evento) => formSubmit(evento)} className='conviteJogo'>
                        <input
                            type="text"
                            placeholder='Insira a matrícula'
                            value={matricula}
                            onChange={(e) => { setMatricula(e.target.value.replace(/[^0-9]/g, '')) }}
                        />
                        <button>CONVIDAR</button>
                    </form>
                </div>

                <div className='center'>
                    <img className='gif' src="./src/assets/gifCentro.gif" alt="" />
                    <p className='typewriter'>Maximize seu aprendizado aqui</p>
                </div>

                <div className='right'>
                    <h1>TOP <span style={{ color: 'yellow' }}>10</span></h1>
                    <div className='areaTop10'>

                        <div className='aluno1'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>

                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        <div className='aluno'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Aluno da Silva</p>
                            <p>Nivel 20</p>
                        </div>
                        

                    </div>
                </div>
            </div>
        </div>



    )
}