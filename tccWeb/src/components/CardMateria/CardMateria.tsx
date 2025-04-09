import { MouseEventHandler } from 'react';

interface CardMateriaProps {
    id: number;
    materiaLogo: string;
    nome: string;
    icon: string;
    onClick: MouseEventHandler<HTMLDivElement> | undefined;  // Corrigido para onClick
}

function CardMateria({ materiaLogo, icon, nome, onClick }: CardMateriaProps) {
    // Função para capitalizar a primeira letra
    function capitalizeFirstLetter(text: string): string {
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    }

    return (
        <div 
        onClick={onClick} 
        className="flex flex-col md:flex-row justify-center md:justify-around gap-3 rounded-md p-4 items-center text-white bg-gray-800 w-[45%] md:w-1/5 cursor-pointer transition-transform ease-in-out hover:scale-105"
    >
        <img className="w-1/4 md:w-1/5" src={materiaLogo} alt="" />
        <div className="w-3/4 md:w-4/5 flex flex-col md:flex-row justify-between items-center gap-2 text-center">
            <p className="text-sm md:text-base">{capitalizeFirstLetter(nome)}</p>
            <img className="w-1/3" src={icon} alt="" />
        </div>
    </div>
    
    );
}

export default CardMateria;
