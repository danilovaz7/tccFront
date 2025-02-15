import { NavLink } from 'react-router';
import React from 'react';

interface NavbarProps {
    id: number;
    nivel: number;
    avatar: string;
}

function Navbar({ id, nivel, avatar }: NavbarProps) {
    return (
        <div className="flex w-full items-center justify-center shadow-2xl">
            <div className="w-4/5 flex items-center justify-center">
                <NavLink className='w-[100%] flex items-center justify-center' to='/home'>
                    <img src="/src/assets/logo1Play2Learn.png" alt="Logo" className="pl-2 w-[20%] " />
                </NavLink>
            </div>
            
            <div className="w-1/10">
                <NavLink to={`/perfil/${id}`}>
                    <div className="w-full h-1/2 flex justify-around items-center gap-2.5 p-1 border border-white rounded-md">
                        <p>Nível {nivel}</p>
                        <img className="w-1/3 rounded-full" src={avatar} alt="Foto de perfil" />
                    </div>
                </NavLink>
            </div>
        </div>
    );
}

export default Navbar;
