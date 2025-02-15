
import { NavLink, useNavigate } from 'react-router';

interface UserCardProps {
    id: number;
    nivel: string;
    nome: string;
    avatar: string;
    classe: string;
    imgClasse: string;
    } 


function UserCard({ id, nivel, avatar, nome, classe,imgClasse }: UserCardProps) {
    const navigate = useNavigate();

    function carregaPerfil() {
        navigate(`/perfil/${id}`);
    }

    return (
        <div className={classe} onClick={() => { carregaPerfil() }}>
            <img className={imgClasse} src={avatar} alt="" />
            <p>{nome}</p>
            <p>Lvl {nivel}</p>
        </div>
    );
}

export default UserCard;