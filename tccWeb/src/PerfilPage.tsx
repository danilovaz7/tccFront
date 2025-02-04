import { FormEvent, useState } from 'react';
import './PerfilPage.css'
import { NavLink } from 'react-router';


export function PerfilPage() {

    return (
        <>
            <div className='containerPerfil'>
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

                <div className='perfilStats'>
                    <div className='perfilTop'>
                        <div className='imgContainer'>
                            <img className='imgPerfil' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />
                        </div>
                        <div className='alunoInfo'>
                            <p>Nome: </p>
                            <p>Sala: </p>
                            <p>Ranking: </p>
                        </div>
                    </div>

                    <div className='caracteristicasGerais'>
                        <div className='status'>
                            <p>Perguntas totais</p>
                            <p>45</p>
                        </div>
                        <div className='status'>
                            <p>Perguntas acertadas</p>
                            <p>31</p>
                        </div>
                        <div className='status'>
                            <p>Disputas</p>
                            <p>10</p>
                        </div>
                    </div>

                    <div className='alunoStats'>
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
            </div>

        </>
    )
}