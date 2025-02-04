import { FormEvent, useState } from 'react';
import './HomePage.css'
import { MdMenu, MdKeyboardArrowRight } from "react-icons/md";
import { NavLink } from 'react-router';

export function HomePage() {

    const [matricula, setMatricula] = useState('')

    function formSubmit(evento: FormEvent<HTMLFormElement>) {
        evento.preventDefault()
        alert(matricula)
    }


    return (
        <>
            <div className='containerHome'>
                <div className='nav'>
                    <div className='menuIcon'>
                    </div>

                    <div className='logoIcon'>
                        <img src="./src/assets/logo1Play2Learn.png" alt="" />
                    </div>

                    <div className='perfilContainer'>
                        <div className='perfil'>

                            <NavLink to="/perfil" end>
                                Nivel 20
                            </NavLink>
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
                            <button className='btn'>CONVIDAR</button>
                        </form>
                    </div>

                    <div className='center'>
                        <img className='gif' src="./src/assets/gifCentro.gif" alt="" />
                    </div>

                    <div className='right'>
                        <h1>Ranking da <span style={{ color: 'yellow' }}>sala</span></h1>
                        <div className='areaTop10'>
                            <div className='aluno1'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                <p>Aluno da Silva</p>
                                <p>Lvl 20</p>
                            </div>

                            <div className='aluno'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                <p>Aluno da Silva</p>
                                <p>Lvl 20</p>
                            </div>
                            <div className='aluno'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                <p>Aluno da Silva</p>
                                <p>Lvl 20</p>
                            </div>
                            <div className='aluno'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                <p>Aluno da Silva</p>
                                <p>Lvl 20</p>
                            </div>
                            <div className='aluno'>
                                <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                                <p>Aluno da Silva</p>
                                <p>Lvl 20</p>
                            </div>
                            <button className='btn'>Ver mais <span><MdKeyboardArrowRight size={16} /></span></button>
                        </div>
                    </div>
                </div>

                <div className='treinamentoMaterias'>

                    <h1 style={{ color: 'cyan' }}>Aperfeiçoe seus conhecimentos</h1>
                    <h3>Selecione a materia que deseja treinar</h3>

                    <div className='materias'>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Matematica</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Fisica</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Ingles</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Historia</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Portugues</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Quimica</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Biologia</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Filosofia</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div><div className='materia'>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                            <p>Sociologia</p>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                    </div>


                </div>
            </div>


        </>
    )
}