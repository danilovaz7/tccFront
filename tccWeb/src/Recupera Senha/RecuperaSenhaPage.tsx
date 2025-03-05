// src/RecuperaSenha/RecuperaSenhaPage.tsx
import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { Button, useDisclosure } from "@heroui/react";

export function RecuperaSenhaPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('Link de recuperação enviado para o seu e-mail.');
        setTimeout(() => navigate('/'), 5000); // Redireciona para login após 5 segundos
      } else {
        const errorText = await response.text();
        setMessage(`Erro: ${errorText}`);
      }
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      setMessage('Erro inesperado, tente novamente.');
    }
  }

  return (
    <div className='flex w-screen flex-col h-full justify-center items-center pt-32 gap-4'>
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
        {message && <p className='mt-4 text-white'>{message}</p>}
      </form>
    </div>
  );
}
