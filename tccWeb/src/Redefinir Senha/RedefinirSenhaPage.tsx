// src/RecuperaSenha/RedefinirSenhaPage.tsx
import { useState, FormEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Alert } from "@heroui/react";

export function RedefinirSenhaPage() {
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [responseState, setResponseState] = useState<boolean | undefined>(undefined);
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
      setResponseState(false)
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
        setResponseState(true)
        setMessage('Senha redefinida com sucesso!');
        setTimeout(() => navigate('/'), 5000); 
      } else {
        setResponseState(false)
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
            {
          responseState !== undefined && (
            <div className="w-[30%] flex items-center my-3">
            <Alert color={responseState ? "success" : "danger"} title={message} />
            </div>
          )
        }
          </>
        ) : (
          <p className='text-white'>Link de recuperação inválido ou expirado.</p>
        )}
      </form>
    </div>
  );
}
