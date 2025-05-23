import { useEffect, useState } from "react";
import { useTokenStore } from "./useTokenStore";
import { user } from "@heroui/react";


export function useMaterias() {
    const [materias, setMaterias] = useState<[]>([]);
    const { token } = useTokenStore();
 
    useEffect(() => {
        async function getMaterias() {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/materias`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            const materias = await response.json();
            setMaterias(materias);
        }
        getMaterias();
    }, [user]);

return materias
}