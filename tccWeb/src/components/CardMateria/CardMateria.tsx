import { NavLink } from 'react-router-dom';

interface CardMateriaProps {
    id: number;
    materiaLogo: string;
    nome: string;
    icon: string;
}

function CardMateria({ materiaLogo, icon, nome }: CardMateriaProps) {
    return (
        <div className="flex flex-row justify-around gap-2.5 rounded-md p-2.5 items-center text-white bg-gray-800 w-1/5 cursor-pointer transition-transform ease-in-out hover:scale-105">
            <img className="w-1/5" src={materiaLogo} alt="" />
            <div className="w-4/5 flex justify-between items-center">
                <p>{nome}</p>
                <img className="w-1/3" src={icon} alt="" />
            </div>
        </div>
    );
}

export default CardMateria;
