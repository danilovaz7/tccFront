import { NavLink } from 'react-router';
import './CardMateria.css'

// Definição das props com TypeScript
interface CardMateriaProps {
    id: number;
    materiaLogo: string;
    nome: string;
    icon: string;

}

function CardMateria({ materiaLogo, icon, nome }: CardMateriaProps) {
    return (
        <div className='materia'>
        <img className='materiaLogo' src={materiaLogo} alt="" />
        <div className='materiaSection'>
            <p>{nome}</p>
            <img className='icon' src={icon} alt="" />
        </div>
    </div>
    );
}

export default CardMateria;