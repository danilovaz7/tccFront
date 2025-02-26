import { ChangeEvent, FormEvent, useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import { NavLink, useNavigate } from 'react-router';
import { useTokenStore } from '../hooks/useTokenStore';

function App() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isCheked, setIsChecked] = useState(false)
  const [hidePass, setHidePass] = useState(true)
  const navigate = useNavigate();
  const { setToken, setUser } = useTokenStore();


  async function handleSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();

    try {
      const response = await fetch(`http://localhost:3000/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, senha }),
      });

      console.log('respoonse', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erro no login:', errorText);
        alert('Falha no login');
        return;
      }

      const json = await response.json();

      const respostaEu = await fetch(`http://localhost:3000/eu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${json.token}`,
        },
        credentials: 'include',
      });

      if (!respostaEu.ok) {
        const errorText = await respostaEu.text();
        console.error('Erro ao obter dados do usuário:', errorText);
        alert('Erro ao obter dados do usuário');
        return;
      }

      const user = await respostaEu.json();

      setToken(json.token);
      setUser(user);

      localStorage.setItem('token', json.token);
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      alert('Erro inesperado, tente novamente.');
    }
  }


  return (
    <div className='flex flex-col h-full justify-center items-center pt-32 gap-4 '>
      <img className='w-[40%] border-2 border-black rounded-[50%] ' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />

      <form className='flex flex-col justify-center items-center rounded-2xl w-[90%] gap-4 p-1 ' onSubmit={(evento) => handleSubmit(evento)} >

        <div className='w-[90%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1 '>

          <input
            className=' w-[80%] p-1.5 border-0 bg-transparent text-white focus:outline-0'
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder='Email...'
            required
          />
          <FaRegUser />

        </div>


        <div className='w-[90%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1 '>
          <input
           className=' w-[80%] p-1.5 border-0 bg-transparent text-white focus:outline-0'
            type={hidePass ? "password" : "text"}
            value={senha}
            onChange={(e) => { setSenha(e.target.value) }}
            placeholder='Senha...'
            required
          />
          <div className='verSenha' onClick={() => { setHidePass(!hidePass) }}>
            {
              hidePass
                ?
                <FaRegEye />
                :
                <FaRegEyeSlash />
            }
          </div >
        </div>

        <button className='w-[35%] bg-cyan-400 flex justify-center items-center p-1.5 rounded-md text-black hover:bg-cyan-700  '>Entrar</button>
        <NavLink to="/recupera-senha" ><button>Esqueci minha senha</button></NavLink>
      </form>
    </div>



  )
}

export default App
