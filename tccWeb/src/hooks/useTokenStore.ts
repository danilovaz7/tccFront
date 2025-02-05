import { create } from 'zustand';

interface User {
  id: number;
  nome: string;
  email: string;
  senha: string;
  foto: string;
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
  setToken: (token: string) => void;
  setUser: (user: User) => void;
}

export const useTokenStore = create<TokenStore>((set) => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  return {
    token: storedToken ? storedToken : undefined,
    user: storedUser ? JSON.parse(storedUser) : undefined,
    setToken: (token) => {
      localStorage.setItem('token', token);
      set({ token });
    },
    setUser: (user) => {
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    }
  };
});
