import { NavLink } from 'react-router';
import React from 'react';
import {Avatar} from "@heroui/react";

interface NavbarProps {
    id: number | undefined;
    nivel: string | undefined;
    avatar: string | undefined
}

function Navbar({ id, nivel, avatar }: NavbarProps) {
    return (
        <div className="flex w-full items-center justify-center shadow-2xl">
            <div className="w-[80%] flex items-center justify-center">
                <NavLink className='w-[100%]  flex items-center justify-start' to='/home'>
                    <img src="/src/assets/logo1Play2Learn.png" alt="Logo" className=" w-[25%] " />
                </NavLink>
            </div>
            
            <div className="w-[15%]">
                <NavLink to={`/perfil/${id}`}>
                    <div className="w-full h-1/2 flex justify-around items-center gap-2 p-3 border border-white rounded-md">
                        <p className='text-2xl'>Nível {nivel}</p>
                        <Avatar size="lg" src={avatar} />
                    </div>
                </NavLink>
            </div>
        </div>
    );
}

export default Navbar;
