import {  FormEvent, useEffect, useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';
import { Alert } from "@heroui/react";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [hidePass, setHidePass] = useState(true);
  const navigate = useNavigate();
  const { setToken, setUser, token, user } = useTokenStore();
  const [mensagem, setMensagem] = useState('')
 const [mensagemCor, setMensagemCor] = useState<"default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined>(undefined)

  useEffect(() => {
    if (token && user) {
      navigate('/home');
    }
  }, [token, user, navigate]);

  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    try {
      // Requisição de login
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro no login:', errorText);
        setMensagem('Falha no login')
        setMensagemCor('danger')
        return;
      }

      // Aqui, o login retorna o token
      const { token: loginToken } = await response.json();

      // Requisição para obter os dados completos do usuário através da rota /eu
      const respostaEu = await fetch(`${import.meta.env.VITE_API_URL}/eu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginToken}`,
        },
      });

      if (!respostaEu.ok) {
        const errorText = await respostaEu.text();
        console.error('Erro ao obter dados do usuário:', errorText);
        setMensagem('Erro ao obter dados do usuário')
        setMensagemCor('danger')
        return;
      }

      const userData = await respostaEu.json();

      setToken(loginToken);
      setUser(userData);

      localStorage.setItem('token', loginToken);
      localStorage.setItem('user', JSON.stringify(userData));

      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setMensagem('Erro inesperado, tente novamente.')
      setMensagemCor('danger')
    }
  }

  return (
    <div className='flex flex-col h-full justify-center items-center pt-28 gap-4'>
      <img
        className='w-[30%] rounded-full'
        src="/assets/userDefault.png"
        alt="User Icon"
      />

      <form onSubmit={handleSubmit} className='flex flex-col justify-center items-center rounded-2xl w-[90%] gap-4 p-1'>
        <div className='w-[40%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
          <input
            className='w-[80%] p-1.5 border-0 bg-transparent text-white focus:outline-none'
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Email...'
            required
            autoComplete="email"
          />
          <FaRegUser />
        </div>

        <div className='w-[40%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
          <input
            className='w-[80%] p-1.5 border-0 bg-transparent text-white focus:outline-none'
            type={hidePass ? "password" : "text"}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder='Senha...'
            required
            autoComplete="current-password"
          />
          <div className='cursor-pointer' onClick={() => setHidePass(!hidePass)}>
            {hidePass ? <FaRegEye /> : <FaRegEyeSlash />}
          </div>
        </div>

        {
          mensagem ?
            <div className="flex items-center justify-center w-full">
              <Alert color={mensagemCor} title={mensagem} />
            </div>
            : null
        }

        <button
          type='submit'
          className='w-[35%] bg-cyan-400 flex justify-center items-center p-1.5 rounded-md text-black hover:bg-cyan-700'
        >
          Entrar
        </button>

        <NavLink to="/recupera-senha">
          <button type='button'>Esqueci minha senha</button>
        </NavLink>
      </form>
    </div>
  );
}

export default LoginPage;
