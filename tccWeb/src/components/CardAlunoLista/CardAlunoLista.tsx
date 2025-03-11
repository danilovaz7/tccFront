import { MouseEventHandler } from 'react';
import { Avatar } from "@heroui/react";

interface CardAlunoListaProps {
    id: number;
    avatar: string;
    nome: string;
    icon: string | undefined,
    nivel: string;
}

function CardAlunoLista({ avatar, icon, nome, nivel }: CardAlunoListaProps) {

    return (
        <div className="w-[30%] bg-gray-800 flex justify-between items-center text-white p-1 cursor-pointer rounded-md transition-transform ease-in-out hover:scale-105" onClick={() => { }}>

        <div className='w-[30%] h-[100%] flex justify-center items-center'>
            <Avatar  src={avatar} className="w-[100px] h-[100px]" />
        </div>

        <div className=' w-[70%] p-5 gap-2 flex flex-col justify-s items-start'>
            <div className='flex w-[100%] justify-between items-center'>
                <p className='text-medium'>{nome}</p>
                <p className='text-xl'>Lvl {nivel}</p>
            </div>

            <div className='flex w-[100%] justify-between items-center'>
                <p className='text-xl'>Rank: </p>
                <img className="w-[25%]"  src={icon} alt="" />
            </div>
        </div>
    </div>
    );
}

export default CardAlunoLista;
