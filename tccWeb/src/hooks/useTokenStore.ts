import { create } from 'zustand';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  avatar: {
    nome: string;
    caminho: string;
  };
  nivel: number;
  matricula: string;
  experiencia: number;
  tipo_usuario_id: number;
  id_turma: number;
  id_escola: number;
  createdAt: string;
  updatedAt: string;
}

interface TokenStore {
  token: string | undefined;
  user: User | undefined;
  setToken: (token: string | undefined) => void;
  setUser: (user: User | undefined) => void;
}

export const useTokenStore = create<TokenStore>((set) => {
  const storedToken = localStorage.getItem('token');
  // Verifica se storedUser existe e não é a string "undefined"
  const rawUser = localStorage.getItem('user');
  const storedUser =
    rawUser && rawUser !== 'undefined' ? JSON.parse(rawUser) : undefined;

  return {
    token: storedToken ? storedToken : undefined,
    user: storedUser,
    setToken: (token) => {
      if (token === undefined) {
        localStorage.removeItem('token');
      } else {
        localStorage.setItem('token', token);
      }
      set({ token });
    },
    setUser: (user) => {
      if (user === undefined) {
        localStorage.removeItem('user');
      } else {
        localStorage.setItem('user', JSON.stringify(user));
      }
      set({ user });
    }
  };
});
