import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash, FaRegUser } from "react-icons/fa";
import './App.css'

function App() {
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [hidePass, setHidePass] = useState(true)


  return (
    <>
      <div className='nav'>
       
      </div>

      <div className='container'>
        <img className='imgPreview' src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png" alt="" />

        <form className='form' >

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


          <button>Entrar</button>
          <a href="">Não lembro minha senha!</a>

        </form>
      </div>

      <div className='footer'>
        <a href="">c</a>
      </div>
    </>
  )
}

export default App
