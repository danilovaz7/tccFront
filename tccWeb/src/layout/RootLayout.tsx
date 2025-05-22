import { useEffect, useState } from "react";
import Navbar from "../components/Navbar/Navbar";
import { useTokenStore } from "../hooks/useTokenStore";
import { Outlet } from "react-router";
import { NavLink, useNavigate } from 'react-router';
import { useParams } from 'react-router';
import { useQueries, useQuery, useQueryErrorResetBoundary, useSuspenseQuery } from '@tanstack/react-query';

interface Usuario {
    id: number,
    nome: string,
    nivel: string,
    tipo_usuario_id: number,
    id_turma: number,
    id_escola: number
    avatar: {
        nome: string,
        caminho: string
    }
}

export function RootLayout() {

    return (
        <div className=" overflow-x-hidden w-screen flex flex-col justify-start items-center h-screen gap-12">
            <Navbar
               
            />

            <Outlet />
        </div>
    );
}