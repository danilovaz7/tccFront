import { FormEvent, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import Navbar from '../components/Navbar/Navbar';
import { Button } from "@heroui/react";

interface Usuario {
    id: number;
    nome: string;
    nivel: string;
    tipo_usuario_id: number;
    id_turma: number;
    id_escola: number;
    avatar: {
        nome: string;
        caminho: string;
    };
}

interface EloMateria {
    id: number,
    usuario_id: number,
    materia_id: number,
    elo_id: number,
    subelo_id: number,
    respostas_corretas_elo: number,
    respostas_corretas_total: number,
    eloIcon: string,
    elo: {
        nome: string,
        elo1: string,
        elo2: string,
        elo3: string
    },
    materia: {
        nome: string,
        icone: string
    }
}

interface Pergunta {
    id: number;
    materia_id: number;
    pergunta: string;
}

interface Alternativa {
    id: number;
    pergunta_id: number;
    alternativa: string;
    correta: boolean
}

interface Resposta {
    pergunta: Pergunta;
    respostaCorreta: string;
    respostaUsuario: string;
}


function Materia() {
    const { token, user } = useTokenStore();
    let { nmMateria } = useParams();
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario>();
    const [perguntasMateria, setPerguntasMateria] = useState<Pergunta[]>([]);
    const [inicioPerguntas, setInicioPerguntas] = useState(false);
    const [contagem, setContagem] = useState(0);
    const [contagemAcertos, setContagemAcertos] = useState(0);
    const [fimDeJogo, setFimDeJogo] = useState(false);
    const [eloMateria, setEloMateria] = useState<EloMateria>();
    const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
    const [alternativasAtuais, setAlternativasAtuais] = useState<Alternativa[]>([]);
    const [perguntasExibidas, setPerguntasExibidas] = useState<Set<number>>(new Set());
    const [respostas, setRespostas] = useState<Resposta[]>([]);
    const [totalAcertosEloAtualizado, setTotalAcertosEloAtualizado] = useState(0);
    const [totalAcertosMateriaAtualizado, setTotalAcertosMateriaAtualizado] = useState(0);

    useEffect(() => {
        setTotalAcertosEloAtualizado((eloMateria?.respostas_corretas_elo || 0) + contagemAcertos);
        setTotalAcertosMateriaAtualizado((eloMateria?.respostas_corretas_total || 0) + contagemAcertos);
    
        if (totalAcertosEloAtualizado > 20) {
            setSubeloAtualizado(3);
        } else if (totalAcertosEloAtualizado > 10 && totalAcertosEloAtualizado <= 20) {
            setSubeloAtualizado(2);
        }
    }, [contagemAcertos, eloMateria, user?.id]);


    function obterPerguntaAleatoria(): Pergunta | null {
        const perguntasRestantes = perguntasMateria.filter((_, index) => !perguntasExibidas.has(index));
        if (perguntasRestantes.length === 0) {
            return null;
        }
        const indiceAleatorio = Math.floor(Math.random() * perguntasRestantes.length);
        return perguntasRestantes[indiceAleatorio];
    }

    function iniciarJogo() {
        setContagem(5);
        const intervalo = setInterval(() => {
            setContagem((prev) => {
                if (prev === 1) {
                    clearInterval(intervalo);
                    setInicioPerguntas(true);
                    const primeiraPergunta = obterPerguntaAleatoria();
                    if (primeiraPergunta) {
                        setPerguntaAtual(primeiraPergunta);
                        setPerguntasExibidas(new Set([perguntasMateria.indexOf(primeiraPergunta)]));
                    }
                    return 0;
                } else {
                    return prev - 1;
                }
            });
        }, 1000);
    }

    function handleSelecionarAlternativa(alternativa: Alternativa) {
        setRespostas((prevRespostas) => {
            const jaRespondida = prevRespostas.some(
                (resposta) => resposta.pergunta.id === perguntaAtual?.id
            );

            if (jaRespondida) return prevRespostas;

            return [
                ...prevRespostas,
                {
                    pergunta: perguntaAtual!,
                    respostaCorreta: alternativasAtuais.find((alt) => alt.correta)?.alternativa || '',
                    respostaUsuario: alternativa.alternativa,
                },
            ];
        });

        alternativa.correta ? setContagemAcertos(contagemAcertos + 1) : null

        const novaPergunta = obterPerguntaAleatoria();
        if (novaPergunta) {
            setPerguntaAtual(novaPergunta);
            setPerguntasExibidas((prevExibidas) =>
                new Set([...prevExibidas, perguntasMateria.indexOf(novaPergunta)])
            );
        } else {
            setFimDeJogo(true);
            setInicioPerguntas(false);
        }
    }

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


    useEffect(() => {
        // Só faz a requisição se 'eloMateria' estiver carregado
        if (eloMateria?.elo_id) {
            async function pegaPerguntasMateria() {
                const response = await fetch(`http://localhost:3000/materias/${nmMateria}/perguntas/${eloMateria.elo_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const perguntas = await response.json();
                setPerguntasMateria(perguntas);
            }
            pegaPerguntasMateria();
        }
    }, [nmMateria, token, eloMateria]); // Dependências atualizadas para 'eloMateria'


    useEffect(() => {
        async function pegaAlternativas() {
            const response = await fetch(`http://localhost:3000/materias/perguntas/${perguntaAtual?.id}/alternativas`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const alternativas = await response.json();
            setAlternativasAtuais(alternativas);
        }
        pegaAlternativas();
    }, [perguntaAtual]);

    useEffect(() => {
        async function pegaEloMaterias() {
            const response = await fetch(`http://localhost:3000/eloMaterias/${usuario?.id}/materia/${nmMateria}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const eloMateriaRsponde = await response.json();
            setEloMateria(eloMateriaRsponde);
            setEloAtualizado(eloMateriaRsponde.elo_id);
            setSubeloAtualizado(eloMateriaRsponde.subelo_id);
        }
        if (usuario?.id && nmMateria) {
            pegaEloMaterias();
        }
    }, [usuario?.id, nmMateria, token]);
    
    useEffect(() => {
        if (eloMateria) {
            setEloAtualizado(eloMateria.elo_id);
            setSubeloAtualizado(eloMateria.subelo_id);
        }
    }, [eloMateria]);

    const [eloAtualizado, setEloAtualizado] = useState<number | null>(null);
    const [subeloAtualizado, setSubeloAtualizado] = useState<number | null>(null);

    async function atualizeXP(xp :number) {
        try {
            const response = await fetch(`http://localhost:3000/usuarios/${user?.id}/atualizaexperiencia`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ xpGanho: xp })
            });

            if (!response.ok) {
                throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Erro ao atualizar o usuário:", error);
        }
    }
    
   async function handleUpdate(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    if((eloAtualizado || 0) >= 7){
      setEloAtualizado(6)
    }

    if(totalAcertosEloAtualizado >= 30 && eloAtualizado != 6){
      atualizeXP(1000 * (eloMateria?.elo_id || 0) )
    }else {
        atualizeXP(20 * contagemAcertos)
    }
  
  
    const resposta = await fetch(`http://localhost:3000/eloMaterias/${usuario?.id}/materia/${nmMateria}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            elo_id: eloAtualizado,
            subelo_id: subeloAtualizado,
            respostas_corretas_elo: totalAcertosEloAtualizado,
            respostas_corretas_total: totalAcertosMateriaAtualizado
        })
    });

    if (resposta.ok) {
        alert('Usuário atualizado com sucesso');
        navigate('/home');
    } else {
        alert("Erro ao atualizar usuário");
    }
}

    return (
        <div className="flex w-screen text-center flex-col h-full justify-start items-center gap-20">
            <Navbar id={usuario?.id} nivel={usuario?.nivel} avatar={usuario?.avatar.caminho} />
            {fimDeJogo ? (
                <div className="w-[90%] pb-20 p-10 flex flex-col justify-center items-center gap-4">
                    <h1 className="text-5xl text-cyan-400">Fim de Jogo!</h1>
                    <p className="text-2xl">Parabéns, você completou todas as perguntas!</p>
                    <h2 className="text-2xl text-cyan-400">Aqui estão suas estatísticas:</h2>
                    <div className="w-[90%] p-5 flex flex-col justify-center items-start gap-4 border-2 border-cyan-400">
                        <p className='text-xl'>Acertos: {contagemAcertos}/{perguntasMateria.length}</p>
                        <p className='text-xl'>Total de acertos no elo atualizados: {totalAcertosEloAtualizado}/30 </p>
                        <p className='text-xl'>Total de acertos na materia atualizados: {totalAcertosMateriaAtualizado} acertos</p>
                    </div>
                    <h2 className="text-2xl mt-6">Respostas:</h2>
                    <div className="w-full max-w-4xl flex flex-col gap-4 mt-4">
                        {respostas.map((resposta, index) => (
                            <div key={index} className="p-4 border rounded-lg shadow-md">
                                <p className="text-xl font-bold">Pergunta: {resposta.pergunta.pergunta}</p>
                                <p className="text-green-500">Resposta Correta: {resposta.respostaCorreta}</p>
                                <p
                                    className={
                                        resposta.respostaUsuario === resposta.respostaCorreta
                                            ? 'text-blue-500'
                                            : 'text-red-500'
                                    }
                                >
                                    Sua Resposta: {resposta.respostaUsuario}
                                </p>
                            </div>
                        ))}
                    </div>
                    <form onSubmit={handleUpdate}>
                        <button className="mt-6 bg-cyan-400 text-black p-4 rounded-md">
                            Voltar ao Início
                        </button>
                    </form>

                </div>
            ) : inicioPerguntas ? (
                <div className="w-[90%] pb-20 p-10 flex flex-col justify-center items-center gap-10">
                    <h1 className="text-2xl">Pergunta</h1>
                    <div className="w-[90%] h-fit p-10 flex flex-col justify-center items-center gap-4 border-2 rounded-md border-cyan-500">
                        <p className="text-2xl">{perguntaAtual?.pergunta}</p>
                    </div>
                    <div className="w-[90%] p-5 flex flex-wrap justify-center items-center gap-5">
                        {
                            alternativasAtuais.map((alternativa, index) => {

                                return (
                                    <div
                                        onClick={() => {
                                            if (alternativa.correta == true) {
                                                setContagemAcertos(contagemAcertos + 1)
                                            }

                                            handleSelecionarAlternativa(alternativa)
                                        }
                                        }
                                        className="w-[45%] hover:bg-cyan-900 rounded-lg p-5 flex justify-start items-center gap-4 border-2 border-cyan-300"
                                    >
                                        <p>{alternativa.alternativa}</p>
                                    </div>
                                );
                            })
                        }
                    </div>
                </div>
            ) : (
                <>
                    {contagem > 0 ? (
                        <>
                            <h1 className="text-4xl">Olá {usuario?.nome}, vamos treinar {nmMateria}?</h1>
                            <p className="text-7xl">{contagem}...</p>
                        </>
                    ) : (
                        <>
                            <h1 className="text-4xl">Olá {usuario?.nome}, vamos treinar {nmMateria}?</h1>
                            <Button onClick={iniciarJogo} size='lg' color='primary'>
                                Iniciar jogo!
                            </Button>
                        </>
                    )}
                </>
            )}
        </div>
    );
}

export default Materia;
