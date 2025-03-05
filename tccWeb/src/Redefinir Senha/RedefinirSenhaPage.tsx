// src/RecuperaSenha/RedefinirSenhaPage.tsx
import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button, useDisclosure } from "@heroui/react";

export function RedefinirSenhaPage() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(token); // Verifique o token no console
    if (!token) {
      setIsTokenValid(false);
      setMessage('Token inválido ou expirado.');
    }
  }, [token]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
  
    if (senha !== confirmarSenha) {
      setMessage('As senhas não coincidem.');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: senha }),
      });
  
      if (response.ok) {
        setMessage('Senha redefinida com sucesso!');
        setTimeout(() => navigate('/'), 5000); // Redireciona para login após 5 segundos
      } else {
        const errorText = await response.text();
        setMessage(`Erro: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao redefinir a senha:', error);
      setMessage('Erro inesperado, tente novamente.');
    }
  }
  

  return (
    <div className='flex w-screen flex-col h-full justify-center items-center pt-32 gap-4'>
      <form className='flex flex-col justify-center items-center rounded-2xl w-[90%] gap-4 p-1' onSubmit={handleSubmit}>
        <h2 className='text-white mb-4'>Redefinir Senha</h2>
        {isTokenValid ? (
          <>
            <div className='w-[50%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
              <input
                type="password"
                placeholder="Nova senha"
                className="w-[100%] p-1.5 border-0 bg-transparent text-white focus:outline-0"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
            </div>
            <div className='w-[50%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
              <input
                type="password"
                placeholder="Confirmar senha"
                className="w-[100%] p-1.5 border-0 bg-transparent text-white focus:outline-0"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
            </div>
            <button className='w-[35%] bg-cyan-400 flex justify-center items-center p-1.5 rounded-md text-black hover:bg-cyan-700'>
              Redefinir Senha
            </button>
            {message && <p className='mt-4 text-white'>{message}</p>}
          </>
        ) : (
          <p className='text-white'>Link de recuperação inválido ou expirado.</p>
        )}
      </form>
    </div>
  );
}
