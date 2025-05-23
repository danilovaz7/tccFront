
interface CardAlunoListaProps {
    id: number;
    avatar: string;
    nome: string;
    icon: string | undefined,
    nivel: string;
}

function CardAlunoLista({ avatar, icon, nome, nivel }: CardAlunoListaProps) {

    return (
        <div
        className="w-full sm:w-[30%] bg-gray-800 flex flex-row justify-between items-center text-white p-2 sm:p-1 cursor-pointer rounded-md transition-transform ease-in-out hover:scale-105"
        onClick={() => {}}
    >
        <div className="w-[30%] h-[100%] flex justify-center items-center">
            <img
                src={avatar}
                className="w-16 h-16 sm:w-[100px] sm:h-[100px] rounded-full"
                alt="Avatar"
            />
        </div>
    
        <div className="w-[65%] p-3 sm:p-5 gap-2 flex flex-col justify-start items-start">
            <div className="flex w-full justify-between items-center">
                <p className="text-sm sm:text-medium">{nome}</p>
                <p className="text-sm sm:text-xl">Lvl {nivel}</p>
            </div>
    
            <div className="flex w-full justify-between items-center">
                <p className="text-sm sm:text-xl">Rank:</p>
                <img
                    className="w-8 h-8 sm:w-[25%]"
                    src={icon}
                    alt="Icon"
                />
            </div>
        </div>
    </div>
    
    );
}

export default CardAlunoLista;
