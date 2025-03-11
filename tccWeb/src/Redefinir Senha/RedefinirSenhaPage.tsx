import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Alert } from "@heroui/react";
import { Form, Input } from "@heroui/react";
import { useFormik } from 'formik';

export function RedefinirSenhaPage() {
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(true);
  const [responseState, setResponseState] = useState<boolean | undefined>(undefined);
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const validatePassword = (values: { senha: string; confirmarSenha: string }) => {
    const errors: { senha?: string; confirmarSenha?: string } = {};
    const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;

    if (!passwordRegex.test(values.senha)) {
      errors.senha = 'A senha deve ter no mínimo 8 caracteres, incluindo pelo menos um número e um caractere especial.';
    }

    if (values.senha !== values.confirmarSenha) {
      errors.confirmarSenha = 'As senhas não coincidem.';
    }

    return errors;
  };

  const formik = useFormik({
    initialValues: {
      senha: '',
      confirmarSenha: ''
    },

    onSubmit: async (values) => {
      try {
        const response = await fetch(`http://localhost:3000/reset-password/${token}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ password: formik.values.senha }),
        });

        if (response.ok) {
          setResponseState(true);
          setMessage('Senha redefinida com sucesso!');
          setTimeout(() => navigate('/'), 5000);
        } else {
          setResponseState(false);
          const errorText = await response.text();
          setMessage(`Erro: ${errorText}`);
        }
      } catch (error) {
        console.error('Erro ao redefinir a senha:', error);
        setMessage('Erro inesperado, tente novamente.');
      }
    }
  });

  useEffect(() => {
    if (!token) {
      setIsTokenValid(false);
      setMessage('Token inválido ou expirado.');
    }
  }, [token]);

  return (
    <div className='flex w-screen flex-col h-full justify-center items-center pt-32 gap-4'>
      <Form
        className="w-[80%] flex flex-col justify-center gap-4 border-2 p-10 border-white"
        onSubmit={formik.handleSubmit}
        onReset={formik.handleReset}
      >
        <h2 className='text-white mb-4'>Redefinir Senha</h2>
        {isTokenValid ? (
          <>
            <div className='w-[50%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
              <Input
                isRequired
                errorMessage={formik.errors.senha}
                label="Senha"
                labelPlacement="outside"
                onChange={formik.handleChange}
                value={formik.values.senha}
                name="senha"
                placeholder="Senha..."
                type="password" // Alterado para ocultar a senha
                classNames={{ label: '!text-white' }}
              />
            </div>
            <div className='w-[50%] flex flex-row justify-around items-center border-2 border-cyan-500 rounded-md p-1'>
              <Input
                isRequired
                errorMessage={formik.errors.confirmarSenha}
                label="Confirmação de senha"
                labelPlacement="outside"
                onChange={(e) => setConfirmarSenha(e.target.value)}
                value={confirmarSenha}
                name="confirmarSenha" // Nome diferente para evitar conflito
                placeholder="Confirme sua senha..."
                type="password" // Alterado para ocultar a senha
                classNames={{ label: '!text-white' }}
              />
            </div>
            <button
              type="submit" // Adicionado para indicar que é um botão de submit
              className='w-[35%] bg-cyan-400 flex justify-center items-center p-1.5 rounded-md text-black hover:bg-cyan-700'
            >
              Redefinir Senha
            </button>
            {responseState !== undefined && (
              <div className="w-[30%] flex items-center my-3">
                <Alert color={responseState ? "success" : "danger"} title={message} />
              </div>
            )}
          </>
        ) : (
          <p className='text-white'>Link de recuperação inválido ou expirado.</p>
        )}
      </Form>
    </div>
  );
}
