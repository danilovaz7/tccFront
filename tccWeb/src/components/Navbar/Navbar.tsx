import { NavLink } from 'react-router';
import './Navbar.css'

// Definição das props com TypeScript
interface NavbarProps {
    id: number;
    nivel: number;
    avatar: string;
}

function Navbar({ id, nivel, avatar }: NavbarProps) {
    return (
        <div className="nav">
            <div className="logoIcon">
            <NavLink to='/home'>
                <img src="/src/assets/logo1Play2Learn.png" alt="Logo" />
                </NavLink>
            </div>

            <div className="perfilContainer">
                <NavLink to={`/perfil/${id}`}>
                    <div className="perfil">
                        <p>Nível {nivel}</p>
                        <img className="imgPerfil" src={avatar} alt="Foto de perfil" />
                    </div>
                </NavLink>
            </div>
        </div>
    );
}

export default Navbar;