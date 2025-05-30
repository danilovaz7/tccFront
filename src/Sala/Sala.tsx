import { useEffect, useState, FormEvent } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { useSocket } from '../hooks/useSocket';

import { Form, Input, Button, Select, SelectItem, Alert,  } from "@heroui/react";
import { useFormik } from 'formik';
import UserCard from '../components/UserCard/UserCard';

interface Usuario {
  id: number;
  nome: string;
  nivel: string;
  tipo_usuario_id: number;
  id_turma: number;
  id_escola: number;
  avatar: { nome: string; caminho: string; };
}

interface Pergunta {
  id: number;
  materia_id: number;
  pergunta: string;
  alternativas: Alternativa[];
  respostaCorreta: string;
}

interface Alternativa {
  id: number;
  pergunta_id: number;
  alternativa: string;
  correta: boolean;
}

interface Sala {
  id: number;
  codigo: string;
  host_id: number;
  status: string;
}

interface ChatMessage {
  message: string;
  sender: string
 }

interface Estatisticas {
  total_disputas: number;
  total_disputas_ganhas: number;
  total_perguntas: number;
  total_perguntas_acertadas: number;
}

interface Score {
  userId: number;
  userName: string;
  pontos: number;
}

interface Aluno {
  usuario: Usuario
}

export function Sala() {
  let { codigo } = useParams();
  const navigate = useNavigate();
  const { token, user } = useTokenStore();
  const socket = useSocket();

  const [usuarioNavBar, setUsuarioNavBar] = useState<Usuario>();
  const [sala, setSala] = useState<Sala>();
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [selectedMaterias, setSelectedMaterias] = useState<number[]>([]);
  const [perguntaAtual, setPerguntaAtual] = useState<Pergunta | null>(null);
  const [alternativasAtuais, setAlternativasAtuais] = useState<Alternativa[]>([]);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatText, setChatText] = useState<string>("");
  const [dados, setDados] = useState<Estatisticas | null>(null);
  const [_perguntasMaterias, setPerguntasMaterias] = useState<Pergunta[]>([]);
  const [carregando, setCarregando] = useState(true);

  const [quizStarted, setQuizStarted] = useState(false);
  const [readyPlayers, setReadyPlayers] = useState<number[]>([]);
  const [tempoRestante, setTempoRestante] = useState(0);
  const [vencedor, setVencedor] = useState<string | null>(null);
  const [jaRespondeu, setJaRespondeu] = useState(false);
  const [scoreboard, setScoreboard] = useState<Score[]>([]);
  const [quizFinalizado, setQuizFinalizado] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [dificuldadeId, setDificuldadeId] = useState<number | null>(null);
  const [mensagem, setMensagem] = useState('')
  const [mensagemCor, setMensagemCor] = useState<"default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>(undefined)
  // Estado para o timer de descanso entre perguntas
  const [restCountdown, setRestCountdown] = useState<number | null>(null);

  // BUSCA DAS MATÉRIAS
  useEffect(() => {
    async function getMaterias() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/materias`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const materias = await response.json();
      setMaterias(materias);
    }
    getMaterias();
  }, [token]);

  const formik = useFormik({
    initialValues: { materias: [] },
    onSubmit: async (values) => {
      try {
        // Verifica se a dificuldade foi selecionada
        if (!dificuldadeId) {
          setMensagem("Por favor, selecione uma dificuldade!");
          setMensagemCor('danger')
          return;
        }
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/sala/${sala?.id}/perguntas/${dificuldadeId}/3/${values.materias[0]}/${values.materias[1]}/${values.materias[2]}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          setMensagem(errorData.error);
          setMensagemCor('danger')
          return;
        }

        const perguntas = await response.json();
        setPerguntasMaterias(perguntas);
        setMensagem('perguntas enviadas com êxito');
        setMensagemCor('success')
        socket?.emit("enviarPerguntas", { roomId: sala?.id, perguntas });
      } catch (error) {
        console.error('Erro no envio das perguntas:', error);
        setMensagem('Ocorreu um erro ao enviar as perguntas.');
        setMensagemCor('danger')
      }
    },
  });

  // BUSCA INFORMAÇÕES DO USUÁRIO
  useEffect(() => {
    async function pegaUsuarioNav() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const userNav = await response.json();
      setUsuarioNavBar(userNav);
    }
    if (user?.id) {
      pegaUsuarioNav();
    }
  }, [user, token]);

  useEffect(() => {
    async function carregarDados() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/estatisticas/${user?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const estaticasUsuario = await response.json();
      setDados(estaticasUsuario);
      setCarregando(false);
    }
    carregarDados();
  }, [user, token])

  // SOCKET EVENTS

  // Countdown
  useEffect(() => {
    if (!socket) return;
    const handleCountdown = ({ countdown }: { countdown: number }) => {
      setCountdown(countdown);
    };
    socket.on("countdown", handleCountdown);
    return () => {
      socket.off("countdown", handleCountdown);
    }
  }, [socket]);

  // Start Question
  useEffect(() => {
    if (!socket) return;
    const handleStartQuestion = ({ pergunta, tempo }: { pergunta: Pergunta, tempo: number }) => {
      setCountdown(null);
      const alternativasEmbaralhadas = [...pergunta.alternativas].sort(() => Math.random() - 0.5);
      setPerguntaAtual(pergunta);
      setAlternativasAtuais(alternativasEmbaralhadas);
      setTempoRestante(tempo);
      
      setVencedor(null);
      setJaRespondeu(false);
      // Limpa o timer de descanso quando iniciar nova pergunta
      setRestCountdown(null);
    };
    socket.on("startQuestion", handleStartQuestion);
    return () => {
      socket.off("startQuestion", handleStartQuestion);
    }
  }, [socket]);

  // Update Timer
  useEffect(() => {
    if (!socket) return;
    const handleUpdateTimer = ({ remainingTime }: { remainingTime: number }) => {
      setTempoRestante(remainingTime);
    };
    socket.on("updateTimer", handleUpdateTimer);
    return () => {
      socket.off("updateTimer", handleUpdateTimer);
    }
  }, [socket]);

  // Question Result
  useEffect(() => {
    if (!socket) return;
    const handleResultadoPergunta = ({  vencedor, scoreboard }: { vencedor: string | null, scoreboard: Score[] }) => {
      setVencedor(vencedor);
      setScoreboard(scoreboard);
      // Inicia o timer de descanso de 5 segundos
      setRestCountdown(5);
    };
    socket.on("resultadoPergunta", handleResultadoPergunta);
    return () => {
      socket.off("resultadoPergunta", handleResultadoPergunta);
    }
  }, [socket]);

  // Timer de descanso no front-end
  useEffect(() => {
    if (restCountdown === null) return;
    if (restCountdown <= 0) {
      setRestCountdown(null);
      return;
    }
    const interval = setInterval(() => {
      setRestCountdown(prev => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(interval);
  }, [restCountdown]);

  // Quiz Finished
  useEffect(() => {
    if (!socket) return;
    const handleQuizFinalizado = ({ scoreboard, vencedorFinal }: { scoreboard: Score[], vencedorFinal: string }) => {
      setScoreboard(scoreboard);
      atualizarSala("encerrada", parseInt(vencedorFinal));
      setQuizFinalizado(true);
      setQuizStarted(false);
    };
    socket.on("quizFinalizado", handleQuizFinalizado);
    return () => {
      socket.off("quizFinalizado", handleQuizFinalizado);
    }
  }, [socket, sala]);

  // Chat
  useEffect(() => {
    if (!socket) return;
    const handleNewMessage = ({ message, sender }: { message: string; sender: string }) => {
      setChatMessages(prev => [...prev, { message, sender }]);
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    }
  }, [socket]);

  // Selected Subjects
  useEffect(() => {
    if (!socket) return;
    const handleMateriasSelecionadas = (materiasSelecionadas: number[]) => {
      setSelectedMaterias(materiasSelecionadas);
      formik.setFieldValue("materias", materiasSelecionadas);
    };
    socket.on("materiasSelecionadas", handleMateriasSelecionadas);
    return () => {
      socket.off("materiasSelecionadas", handleMateriasSelecionadas);
    }
  }, [socket, formik]);

  // Update Ready Players
  useEffect(() => {
    if (!socket) return;
    const handleUpdateReady = (data: { readyUserIds: number[] }) => {
      setReadyPlayers(data.readyUserIds);
    };
    socket.on("updateReady", handleUpdateReady);
    return () => {
      socket.off("updateReady", handleUpdateReady);
    }
  }, [socket]);

  // Start Quiz
  useEffect(() => {
    if (!socket) return;
    const handleIniciarQuiz = () => {
      atualizarSala("em andamento", null);
      setQuizStarted(true);
      setQuizFinalizado(false);
    };
    socket.on("iniciarQuiz", handleIniciarQuiz);
    return () => {
      socket.off("iniciarQuiz", handleIniciarQuiz);
    }
  }, [socket, sala]);

  async function atualizarSala(status: string, vencedorId: number | null) {
    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/sala/${sala?.codigo}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        status: status,
        vencedor_id: vencedorId
      })
    });

    if (resposta.ok) {
      console.log('sala em andamento');
    } else {
      console.log('erro ao atualizar sala');
    }
  }

  // Receiving Questions via Socket
  useEffect(() => {
    if (!socket) return;
    const handleReceberPerguntas = (perguntas: any) => {
      console.log("Perguntas recebidas via Socket:", perguntas);
       setPerguntasMaterias(perguntas);
    };
    socket.on("receberPerguntas", handleReceberPerguntas);
    return () => {
      socket.off("receberPerguntas", handleReceberPerguntas);
    }
  }, [socket]);

  // Answering a question
  async function handleSelecionarAlternativa(alternativa: Alternativa) {
    if (jaRespondeu) return;
    setJaRespondeu(true);

    const resposta = await fetch(`${import.meta.env.VITE_API_URL}/sala/resposta-aluno`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        sala_id: sala?.id,
        usuario_id: user?.id,
        pergunta_id: perguntaAtual?.id,
        resposta_id: alternativa.id,
      })
    });

    if (resposta.ok) {
      console.log('resposta salva')
    }

    socket?.emit("responderPergunta", {
      roomId: sala?.id,
      userId: user?.id,
      respostaId: alternativa.id,
      userName: usuarioNavBar?.nome,
    });
  }

  // Chat message send
  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (socket && sala?.id && chatText.trim() !== "") {
      socket.emit("message", { roomId: sala.id, message: chatText, userName: usuarioNavBar?.nome });
    }
    setChatText('');
  };

  // Subject selection for host
  const handleSelectMateria = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const value = parseInt(e.target.value);
    const updatedMaterias = [...selectedMaterias];
    updatedMaterias[index] = value;
    setSelectedMaterias(updatedMaterias);
    formik.setFieldValue("materias", updatedMaterias);
    if (socket && sala?.id) {
      socket.emit("materiasSelecionadas", { roomId: sala.id, selectedMaterias: updatedMaterias });
    }
  };

  // "Pronto" button
  const handlePronto = () => {
    if (socket && sala?.id && user) {
      socket.emit("pronto", { roomId: sala.id, userId: user.id });
    }
  };

  // Removido o botão de "Próxima Pergunta" pois agora a transição é automática.
  // O evento "nextQuestion" continua existente no back-end (caso queira manter como fallback),
  // mas não é mais disparado pelo front-end.

  // Get room data
  useEffect(() => {
    async function pegaSala() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sala/${codigo}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const salaData = await response.json();
      setSala(salaData);
    }
    if (codigo) {
      pegaSala();
    }
  }, [codigo, token]);

  // Get room students
  useEffect(() => {
    async function pegaSalaAlunos() {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/sala-alunos/${sala?.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const salaAlunos = await response.json();
      setAlunos(salaAlunos);
    }
    if (sala?.id) {
      pegaSalaAlunos();
    }
  }, [sala, token, socket]);

  useEffect(() => {
    if (!socket) return;
    const handlePlayersUpdated = (players: Array<{ userId: number; userName: string; lvl: string }>) => {
      const alunosFormatados = players.map(player => ({
        usuario: {
          id: player.userId,
          nome: player.userName,
          nivel: player.lvl,
          tipo_usuario_id: 0,
          id_turma: 0,
          id_escola: 0,
          avatar: { nome: "", caminho: "" },
        }
      }));
      setAlunos(alunosFormatados);
    };
    socket.on("playersUpdated", handlePlayersUpdated);
    return () => {
      socket.off("playersUpdated", handlePlayersUpdated);
    }
  }, [socket]);
  console.log(alunos)

  useEffect(() => {
    if (socket && user && sala?.id) {
      socket.emit("joinRoom", { roomId: sala.id, userName: usuarioNavBar?.nome, userId: usuarioNavBar?.id, lvl: usuarioNavBar?.nivel });
    }
  }, [socket, user, sala, usuarioNavBar]);

  async function atualizeXP(xp: number) {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/usuarios/${user?.id}/atualizaexperiencia`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
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

  async function handleVoltar() {
    const userIndex = scoreboard.findIndex(scoreUser => scoreUser.userId === usuarioNavBar?.id);
    const dificuldade = dificuldadeId ?? 1;

    const xpToUpdate = userIndex === 0 ? (1000 * dificuldade) : (100 * dificuldade);

    await atualizeXP(xpToUpdate);
    navigate('/home');
  }

  function renderScoreboard() {
    if (scoreboard.length === 0) return null;
    const sorted = [...scoreboard].sort((a, b) => b.pontos - a.pontos);
    return (
      <div className="w-[100%] md:w-[40%] p-5 border rounded-md mt-5 border-cyan-500">
        <h2 className="text-xl font-bold mb-3">Placar</h2>
        {sorted.map(({ userId, userName, pontos }) => (
          <div key={userId} className="flex justify-between border-b py-1 border-cyan-700">
            <span>{userName}</span>
            <span>{pontos} ponto{pontos !== 1 && 's'}</span>
          </div>
        ))}
      </div>
    );
  }

  if (!usuarioNavBar) {
    return <p className=" p-5">Carregando...</p>;
  }
  if (!sala || !sala.codigo) return null;
  if (carregando && usuarioNavBar?.tipo_usuario_id === 2) return <p className=" p-5">Carregando estatísticas...</p>;
  if (!dados && usuarioNavBar?.tipo_usuario_id === 2) return <p className=" p-5">Erro ao carregar estatísticas.</p>;

  return (
    <div className="min-h-screen md:w-[100%] ">
      {quizFinalizado ? (
        <div className="w-full flex flex-col justify-start items-center gap-12 pb-10 mb-40 px-4">
          <h1 className="text-3xl font-bold">Quiz Finalizado!</h1>
          <div className="w-full md:w-[80%] flex flex-col md:flex-row justify-around items-start gap-5">
            {/* Placar Final */}
            <div className="w-full md:w-[40%] p-5 border rounded-md border-cyan-500">
              <h2 className="text-2xl font-bold mb-3">Placar Final</h2>
              {scoreboard
                .sort((a, b) => b.pontos - a.pontos)
                .map(({ userId, userName, pontos }) => (
                  <div
                    key={userId}
                    className="flex justify-between border-b py-1 border-cyan-700"
                  >
                    <span>{userName}</span>
                    <span>
                      {pontos} ponto{pontos !== 1 && "s"}
                    </span>
                  </div>
                ))}
            </div>
            {/* Chat */}
            <div className="w-full md:w-[40%] border p-5 flex flex-col gap-5 rounded-md border-cyan-500">
              <h1 className="text-xl font-bold">Chat</h1>
              <div className="flex flex-col gap-2 border p-2 h-80 overflow-y-auto border-cyan-700">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="p-1 border-b border-cyan-700">
                    <strong>{msg.sender}: </strong>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1  "
                />
                <Button
                  type="submit"
                  color="primary"
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Enviar
                </Button>
              </form>
            </div>
          </div>
          <Button
            size="lg"
            onPress={handleVoltar}
            color="primary"
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            Encerrar sala
          </Button>
        </div>
      ) : quizStarted ? (
        <div className="w-full flex flex-col justify-center items-center gap-12 pb-10 mb-40 px-4">
          {countdown !== null ? (
            <div className="text-4xl font-bold">Iniciando em {countdown}...</div>
          ) : (
            <div className="w-full md:w-[90%] pb-20 p-10 flex flex-col justify-center items-center gap-10">
              <h1 className="text-2xl">Pergunta</h1>
              <div className="w-full md:w-[90%] p-10 flex flex-col justify-center items-center gap-4 border-2 rounded-md border-cyan-500">
                <p className="text-2xl">{perguntaAtual?.pergunta}</p>
              </div>
              <div>
                <p>Tempo restante: {tempoRestante} segundos</p>
              </div>
              <div className="w-full md:w-[90%] p-5 flex flex-col md:flex-wrap md:flex-row justify-center items-center gap-5">
                {alternativasAtuais.map((alternativa, index) => ( // Sem o .sort()
                  <div
                    key={index}
                    onClick={() => handleSelecionarAlternativa(alternativa)}
                    className={`w-[100%] md:w-[45%] hover:bg-cyan-700 rounded-lg p-5 flex justify-start items-center gap-4 border-2 border-cyan-500 cursor-pointer ${jaRespondeu ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    <p>{alternativa.alternativa}</p>
                  </div>
                ))}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {vencedor ? `Vencedor da rodada: ${vencedor}` : ""}
                </p>
              </div>
              {/* Mostra o timer de descanso quando o resultado está disponível */}
              {vencedor !== null && restCountdown !== null && (
                <div className="text-2xl">Próxima pergunta em: {restCountdown} segundos</div>
              )}
              {renderScoreboard()}
              {/* Botão de Próxima Pergunta removido, pois agora a transição é automática */}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full flex flex-col justify-start items-center gap-12 pb-10 mb-40 px-4">
          <div className="w-full md:w-[95%] border flex flex-col md:flex-row justify-center items-start gap-10 p-5 border-cyan-500 rounded-md">
            {/* Dados da sala e seleção de disciplinas */}
            <div className="w-full md:w-[25%] flex flex-col gap-10 p-5">
              <div className="w-full flex flex-col gap-5 p-5 border border-cyan-500 rounded-md">
                <p>
                  Código de sala: <span className="font-bold text-3xl">{codigo}</span>
                </p>
                <p>
                  Prontos: {readyPlayers.length} / {alunos.length}
                </p>
                   <p>
                  Porfavor, envie as disciplinas e dificuldade antes de iniciar a partida
                </p>
              </div>
              {user?.id === sala?.host_id ? (
                <>
                  <h1 className="text-xl font-bold">Selecione 3 disciplinas</h1>
                  <Form
                    className="w-full flex flex-col justify-center items-center gap-4"
                    onSubmit={formik.handleSubmit}
                    onReset={formik.handleReset}
                  >
                    {["materia1", "materia2", "materia3"].map((materiaKey, index) => (
                      <Select
                        key={materiaKey}
                        onChange={(e) => handleSelectMateria(e, index)}
                        value={selectedMaterias[index] || ""}
                        className="w-full md:w-4/5  text-black"
                        label={`Selecione a disciplina ${index + 1}`}
                      >
                        {materias.map((materia) => (
                          <SelectItem
                            key={`${materia.id}-${index}`}
                            
                            className="text-black"
                          >
                            {materia.nome}
                          </SelectItem>
                        ))}
                      </Select>
                    ))}

                    <Select
                      className="w-full md:w-4/5  text-black"
                      label="Selecione uma dificuldade"
                      value={dificuldadeId ?? ""}
                      onChange={(e) => setDificuldadeId(parseInt(e.target.value))}
                    >
                      <SelectItem  key={1} className="text-black">{'Aprendiz'}</SelectItem>
                      <SelectItem  key={2} className="text-black">{'Regular'}</SelectItem>
                      <SelectItem  key={3} className="text-black">{'Estudioso'}</SelectItem>
                      <SelectItem  key={4} className="text-black">{'Exemplar'}</SelectItem>
                      <SelectItem  key={5} className="text-black">{'Avançado'}</SelectItem>
                      <SelectItem  key={6} className="text-black">{'Brilhante'}</SelectItem>
                    </Select>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        color="primary"
                        type="submit"
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        Enviar
                      </Button>
                      <Button
                        size="sm"
                        type="reset"
                        variant="flat"
                        className="border border-cyan-500 "
                      >
                        Limpar
                      </Button>
                    </div>
                  </Form>
                  {
                    mensagem ?
                      <div className="flex items-center justify-center w-full">
                        <Alert color={mensagemCor} title={mensagem} />
                      </div>
                      : null
                  }
                </>
              ) : (
                <div className="w-full flex flex-col justify-center items-center gap-4">
                  <h2 className="text-xl font-bold">Matérias Selecionadas:</h2>
                  {selectedMaterias && selectedMaterias.length > 0 ? (
                    selectedMaterias.map((materiaId, index) => {
                      const materia = materias.find((m) => m.id === materiaId);
                      return (
                        <p key={index} className="text-lg font-semibold">
                          {materia ? materia.nome : "Matéria não encontrada"}
                        </p>
                      );
                    })
                  ) : (
                    <p>Nenhuma matéria selecionada</p>
                  )}
                </div>
              )}
            </div>
            {/* Lista de jogadores */}
            <div className="w-full md:w-[40%] p-5 flex flex-col items-center gap-5">
              <h1 className="text-xl font-bold">Lista de jogadores</h1>
              <div className="flex flex-col items-center gap-5 w-full pb-10">
                {alunos.map((aluno) => (
                  <UserCard
                    key={aluno.usuario.id}
                    id={aluno.usuario.id}
                    nivel={aluno.usuario.nivel}
                    nome={aluno.usuario.nome}
                    classe="w-full md:w-3/5 bg-gray-800 flex justify-between items-center text-white p-2.5 cursor-pointer rounded-md"
                  />
                ))}
              </div>
              <div className="text-4xl font-bold">Iniciando em {countdown}...</div>
              {alunos.length >= 2 && (
                <Button
                  size="lg"
                  onClick={handlePronto}
                  color="primary"
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Pronto
                </Button>
              )}
            </div>
            {/* Chat */}
            <div className="w-full md:w-[25%] border p-5 flex flex-col gap-5 rounded-md border-cyan-500">
              <h1 className="text-xl font-bold">Chat</h1>
              <div className="flex flex-col gap-2 border p-2 h-80 overflow-y-auto border-cyan-700">
                {chatMessages.map((msg, index) => (
                  <div key={index} className="p-1 border-b border-cyan-700">
                    <strong>{msg.sender}: </strong>
                    <span>{msg.message}</span>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={chatText}
                  onChange={(e) => setChatText(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1  "
                />
                <Button
                  type="submit"
                  color="primary"
                  className="bg-cyan-500 hover:bg-cyan-600"
                >
                  Enviar
                </Button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
