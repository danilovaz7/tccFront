import { NavLink, useNavigate } from 'react-router';
import { Avatar } from "@heroui/react";
import { MouseEventHandler } from 'react';

interface UserCardProps {
    id: number;
    nivel?: string;
    nome: string;
    avatar?: string; 
    classe: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

function UserCard({ id, nivel, avatar, nome, classe,onClick }: UserCardProps) {

    return (
        <div className={classe} onClick={onClick}>
            {avatar && <Avatar size='lg' src={avatar} />}
            <p>{nome}</p>
            {nivel && <p>Lvl {nivel}</p>}
        </div>
    );
}

export default UserCard;
