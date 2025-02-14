import { NavLink, useNavigate } from 'react-router';
import './UserCardRank.css'

// Definição das props com TypeScript
interface UserCardRankProps {
    id: number;
    nivel: string;
    nome: string;
    avatar: string;
    acertos: number;
    classe: string;
    classeStats: string;
}

function UserCardRank({ id, nivel, avatar, nome, acertos,classe,classeStats }: UserCardRankProps) {
    const navigate = useNavigate();

    function carregaPerfil() {
        navigate(`/perfil/${id}`);
    }

    return (
        <div className={classe} onClick={() => {carregaPerfil()}}>
            <img src={avatar} alt="" />
            <div className={classeStats}>
                <p>Nome: {nome}</p>
                <p>Acertos {acertos}%</p>
                <p>Lvl {nivel}</p>
            </div>
        </div>
    );
}

export default UserCardRank;