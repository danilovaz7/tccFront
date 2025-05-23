// src/RecuperaSenha/RecuperaSenhaPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Alert } from "@heroui/react";

export function RecuperaSenhaPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [responseState, setResponseState] = useState<boolean | undefined>(undefined);
  const navigate = useNavigate();

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    try {
      const response = await fetch('${import.meta.env.VITE_API_URL}/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setResponseState(true)
        setMessage('Link de recuperação enviado para o seu e-mail.');
        setTimeout(() => navigate('/'), 5000); // Redireciona para login após 5 segundos
      } else {
        setResponseState(false)
        const errorText = await response.text();
        setMessage(errorText);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      setMessage('Erro inesperado, tente novamente.');
    }
  }


  return (
    <div className='flex w-screen flex-col  justify-center items-center gap-4'>
      <div className=' shadow-2xl p-5 w-screen flex '>
        <p onClick={() => { navigate('/')}} className='text-2xl'>{'<   '}Voltar</p>
      </div>
      <form className='flex flex-col justify-center items-center rounded-2xl w-[90%] gap-4 p-1' onSubmit={handleSubmit}>
        <h2 className='text-white mb-4'>Recuperação de Senha</h2>
        <div className='w-[50%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
          <input
            type="email"
            placeholder="Digite seu e-mail"
            className="w-[100%] p-1.5 border-0 bg-transparent text-white focus:outline-0"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <button className='w-[15%] bg-cyan-400 flex justify-center items-center p-1.5 rounded-md text-black hover:bg-cyan-700'>
          Enviar Link
        </button>
        {
          responseState !== undefined && (
            <div className="w-[45%] flex items-center my-3">
            <Alert color={responseState ? "success" : "danger"} title={message} />
            </div>
          )
        }

      </form>
    </div>
  );
}
