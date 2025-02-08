import { ChangeEvent, FormEvent, useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import './App.css'
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

    <div className='container'>
      <img className='imgPreview' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />

      <form className='form' onSubmit={(evento) => handleSubmit(evento)} >

        <div className='inputArea'>

          <input
            type="text"
            value={email}
            onChange={(e) => { setEmail(e.target.value) }}
            placeholder='Email...'
            required
          />
          <FaRegUser />

        </div>


        <div className='inputArea'>
          <input
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

        <button className='btnLogin'>Entrar</button>
        <a href="">Não lembro minha senha!</a>

        <NavLink to="/home" >
          ir para home
        </NavLink>

      </form>
    </div>



  )
}

export default App
