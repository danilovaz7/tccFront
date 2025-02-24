
import { NavLink, useNavigate } from 'react-router';
import {Avatar} from "@heroui/react";

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
                  <Avatar className={imgClasse} src={avatar} />
            <p>{nome}</p>
            <p>Lvl {nivel}</p>
        </div>
    );
}

export default UserCard;