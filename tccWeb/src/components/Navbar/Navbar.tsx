import { NavLink, useNavigate } from 'react-router';
import { Button } from "@heroui/react";
import { useTokenStore } from '../../hooks/useTokenStore';


interface NavbarProps {
  id: number | undefined;
  nivel: string | undefined;
  avatar: string | undefined;
}

function Navbar({ id, nivel, avatar }: NavbarProps) {
  const navigate = useNavigate();
  const { setToken, setUser } = useTokenStore();

  function handleLogout() {
    // Remove o token e o usuário do localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Atualiza o estado global para undefined
    setToken(undefined);
    setUser(undefined);
    // Redireciona para a tela de login
    navigate('/');
  }

  return (
    <div className="flex w-full items-center justify-between shadow-2xl p-3">
      <div className="flex items-center justify-start w-[60%] sm:w-[70%]">
        <img 
          onClick={() => { navigate('/home') }} 
          src="/src/assets/logo1Play2Learn.png" 
          alt="Logo" 
          className="w-[80%] sm:w-[35%] cursor-pointer" 
        />
      </div>
      
      <div className="flex items-center justify-end w-[40%] sm:w-[20%] gap-4">
        <NavLink to={`/perfil/${id}`} className="w-full">
          <div className="w-full flex items-center justify-around gap-2 p-2 sm:p-3 border border-white rounded-md">
            <p className="text-sm sm:text-xl">Nível {nivel}</p>
            <img 
              className="w-12 sm:w-16 rounded-full" 
              src={avatar} 
              alt="Imagem de perfil" 
            />
          </div>
        </NavLink>
        <Button onClick={handleLogout} color="secondary">
          Logout
        </Button>
      </div>
    </div>
  );
}

export default Navbar;
