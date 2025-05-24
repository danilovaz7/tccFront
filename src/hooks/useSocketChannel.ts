import { useEffect, useState } from "react";
import {  Socket } from "socket.io-client";



export function useSocket() {
    const [socket] = useState<Socket | null>(null);

  useEffect(() => {
          if (!socket) return;
          const funcao = ({  }: { alunosAtualizados: [] }) => {
            
          };
          socket.on("atualizar_sala", funcao);
          return () => {
              socket.off("atualizar_sala", funcao);
          };
      }, [socket]);

    return socket;
}