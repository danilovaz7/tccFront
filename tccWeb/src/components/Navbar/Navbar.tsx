import { NavLink, useNavigate } from 'react-router';
import { Button } from "@heroui/react";
import { useTokenStore } from '../../hooks/useTokenStore';
import { FaPowerOff } from 'react-icons/fa';

interface NavbarProps {
  id: number | undefined;
  nivel: string | undefined;
  avatar: string | undefined;
}

function Navbar({ id, nivel, avatar }: NavbarProps) {
  const navigate = useNavigate();
  const { setToken, setUser } = useTokenStore();

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(undefined);
    setUser(undefined);
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
      </div>

      <button onClick={handleLogout} className='bg-cyan-500 p-3 rounded-lg'>
        <FaPowerOff size={16} color="black" />
      </button>
    </div>
  );
}

export default Navbar;
