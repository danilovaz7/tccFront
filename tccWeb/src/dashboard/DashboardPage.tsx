import { user } from '@heroui/react';
import React, { useState } from 'react';
import { useTokenStore } from '../hooks/useTokenStore';

function DashBoardPage() {
   const { token, user } = useTokenStore();
  const [month, setMonth] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboardStats = async (selectedMonth) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/escola/${user?.id}/dashboard?month=${selectedMonth}`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Erro ao buscar estatísticas', error);
    }
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchDashboardStats(month);
  };

  return (
    <div className="min-h-screen  text-gray-100 p-8">
      <div className="max-w-5xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-cyan-400 mb-6">📊 Dashboard</h1>

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
              Estatísticas para <span className="text-cyan-400">{month}</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Matéria com mais respostas erradas</h3>
                <p className="text-lg font-bold text-red-400">
                  {stats.materiaComMaisRespostasErradas
                    ? `${stats.materiaComMaisRespostasErradas.nome} (${stats.materiaComMaisRespostasErradas.wrongCount})`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Matéria com mais respostas corretas</h3>
                <p className="text-lg font-bold text-green-400">
                  {stats.materiaComMaisRespostasCorretas
                    ? `${stats.materiaComMaisRespostasCorretas.nome} (${stats.materiaComMaisRespostasCorretas.correctCount})`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Pergunta mais errada</h3>
                <p className="text-lg font-bold text-red-300">
                  {stats.perguntaMaisErrada
                    ? `${stats.perguntaMaisErrada.pergunta} (${stats.perguntaMaisErrada.wrongCount})`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Pergunta mais certa</h3>
                <p className="text-lg font-bold text-green-300">
                  {stats.perguntaMaisCerta
                    ? `${stats.perguntaMaisCerta.pergunta} (${stats.perguntaMaisCerta.correctCount})`
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Salas encerradas</h3>
                <p className="text-lg font-bold text-gray-100">
                  {stats.salasEncerradas}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow">
                <h3 className="text-sm text-gray-400">Média de alunos por sala</h3>
                <p className="text-lg font-bold text-gray-100">
                  {stats.mediaAlunosPorSala !== undefined
                    ? Number(stats.mediaAlunosPorSala).toFixed(2)
                    : 'N/A'}
                </p>
              </div>

              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4 shadow col-span-1 sm:col-span-2 lg:col-span-3">
                <h3 className="text-sm text-gray-400">Total de respostas enviadas</h3>
                <p className="text-xl font-bold text-cyan-400">
                  {stats.totalRespostas}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashBoardPage;
