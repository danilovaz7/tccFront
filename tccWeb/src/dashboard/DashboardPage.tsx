import React, { useState } from 'react';
import { useTokenStore } from '../hooks/useTokenStore';

function DashBoardPage() {
  const { token, user } = useTokenStore();
  const [month, setMonth] = useState('');
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async (selectedMonth: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/escola/${user?.id}/dashboard?month=${selectedMonth}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas', error);
    }
    setLoading(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchDashboardStats(month);
  };

  return (
    <div className="min-h-screen text-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">Dashboard</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <label className="text-gray-300 font-medium">
            Selecione o Mês:
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1 sm:mt-0 sm:ml-2 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
          </label>
          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-500 text-white px-5 py-2 rounded-lg transition duration-200"
          >
            Buscar
          </button>
        </form>

        {loading && (
          <p className="text-cyan-400 font-medium">Carregando dados...</p>
        )}

        {stats && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-200">
              Estatísticas para <span className="text-cyan-400">{month || 'todos os meses'}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
 
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Matéria com mais erros</h3>
                <div className="mt-2">
                  <p className="text-lg font-bold text-red-400">
                    {stats.materiaComMaisRespostasErradas?.nome || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Erros: <span className="text-red-300">{stats.materiaComMaisRespostasErradas?.wrongCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Matéria com mais acertos</h3>
                <div className="mt-2">
                  <p className="text-lg font-bold text-green-400">
                    {stats.materiaComMaisRespostasCorretas?.nome || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Acertos: <span className="text-green-300">{stats.materiaComMaisRespostasCorretas?.correctCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Pergunta mais errada</h3>
                <div className="mt-2">
                  <p className="text-lg font-bold text-red-300" title={stats.perguntaMaisErrada?.pergunta}>
                    {stats.perguntaMaisErrada?.pergunta || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Matéria: <span className="text-red-200">{stats.perguntaMaisErrada?.materia?.nome || 'N/A'}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Erros: <span className="text-red-200">{stats.perguntaMaisErrada?.wrongCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Pergunta mais certa</h3>
                <div className="mt-2">
                  <p className="text-lg font-bold text-green-300" title={stats.perguntaMaisCerta?.pergunta}>
                    {stats.perguntaMaisCerta?.pergunta || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Matéria: <span className="text-green-200">{stats.perguntaMaisCerta?.materia?.nome || 'N/A'}</span>
                  </p>
                  <p className="text-sm text-gray-400 mt-1">
                    Acertos: <span className="text-green-200">{stats.perguntaMaisCerta?.correctCount || 0}</span>
                  </p>
                </div>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Salas (Online)</h3>
                <p className="text-2xl font-bold text-gray-100 mt-2">
                  {stats.salasEncerradas?.online || 0}
                </p>
              </div>

              {/* Salas encerradas (Offline) */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Salas (Offline)</h3>
                <p className="text-2xl font-bold text-gray-100 mt-2">
                  {stats.salasEncerradas?.offline || 0}
                </p>
              </div>

              {/* Média de alunos por sala */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Média de alunos/sala</h3>
                <p className="text-2xl font-bold text-gray-100 mt-2">
                  {stats.mediaAlunosPorSala !== undefined
                    ? Number(stats.mediaAlunosPorSala).toFixed(2)
                    : '0.00'}
                </p>
              </div>

              {/* Total de respostas */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow col-span-full">
                <h3 className="text-sm text-gray-400">Total de respostas</h3>
                <p className="text-3xl font-bold text-cyan-400 mt-2">
                  {stats.totalRespostas || 0}
                </p>
              </div>
            </div>
            
            {/* Ranking por Turma */}
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-200">
               Top 3 alunos com mais erros por turma
              </h2>
              <p className='text-xs'>São levados em consideração erros tanto em partidas online quanto em treinamento offline</p>
              {stats.rankingPorTurma &&
                Object.keys(stats.rankingPorTurma).map((turma) => (
                  <div key={turma} className="mt-4">
                    <h3 className="text-lg font-semibold text-cyan-400">Turma: {turma}º ano</h3>
                    <ul className="pl-4">
                      {stats.rankingPorTurma[turma].map((aluno: any) => (
                        <li key={aluno.id} className="text-gray-100">
                          {aluno.nome} - Erros: {aluno.wrongCount}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoardPage;
