import { ChangeEvent, FormEvent, useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import './App.css'
import { NavLink } from 'react-router';

function App() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [isCheked, setIsChecked] = useState(false)
  const [hidePass, setHidePass] = useState(true)

  function formSubmit(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (!isCheked) {
      alert('campo necessario faltando')
    } else {
      alert('sucesso no login')
      setEmail('')
      setSenha('')
    }
  }

  return (
    <>
      <div className='container'>
        <img className='imgPreview' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />

        <form className='form' onSubmit={(evento) => formSubmit(evento)} >

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

          <div className='termos'>
            <input type="checkbox" value={isCheked.toString()} onChange={(e) => setIsChecked(e.target.checked)} />
            <label htmlFor="">Li e aceito os termos de uso</label>
          </div>

          <button className='btnLogin'>Entrar</button>
          <a href="">Não lembro minha senha!</a>

          <NavLink to="/home" end>
            ir para home
          </NavLink>

        </form>
      </div>


    </>
  )
}

export default App
