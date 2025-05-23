import {useNavigate } from 'react-router';


// Definição das props com TypeScript
interface UserCardRankProps {
    id: number;
    nivel: string;
    nome: string;
    avatar: string;
    acertos: number;
    classe: string;
    classeStats: string;
    classeImg: string;
}

function UserCardRank({ id, nivel, avatar, nome, acertos,classe,classeStats,classeImg }: UserCardRankProps) {
    const navigate = useNavigate();

    function carregaPerfil() {
        navigate(`/perfil/${id}`);
    }

    return (
        <div className={classe} onClick={() => {carregaPerfil()}}>
            <img className={classeImg} src={avatar} alt="" />
            <div className={classeStats}>
                <p>Nome: {nome}</p>
                <p>WinRate {acertos}%</p>
                <p>Lvl {nivel}</p>
            </div>
        </div>
    );
}

export default UserCardRank;