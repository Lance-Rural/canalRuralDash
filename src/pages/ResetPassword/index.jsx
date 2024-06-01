import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "@/hooks/useAuth";
import { Loading } from "@/components/Loading";

import logo from "@/assets/canalRural.svg";

import { Link } from "react-router-dom";

const signInSchema = yup.object({
  email: yup
    .string()
    .required("Informe o e-mail.")
    .email("É necessário um email válido."),
});

export default function ResetPassword() {
  const { loadingAuth, restorePassword } = useAuth();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  function handleResetPassword() {
    restorePassword(getValues("email"));
  }

  return (
    <>
      <div className="flex min-h-full min-h-screen bg-[url('https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="bg-white bg-opacity-80 sm:w-3/6 w-full rounded-lg sm:px-20 px-10">
          <div>
            <img className="h-12 mt-10 m-auto" src={logo} alt="Lance Rural" />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-slate-600">
              Recuperação de senha
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-500 text-center mb-2">
              Digite o email cadastrado para resetar sua senha.
            </p>
          </div>
          <form
            className="space-y-6"
            onSubmit={handleSubmit(handleResetPassword)}
          >
            <div className="relative -space-y-px rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-0 z-10 rounded-md ring-1 ring-inset ring-gray-300" />
              <div>
                <input
                  autoComplete="email"
                  placeholder="Ex: meuemail@canalrural.com.br"
                  className="relative block w-full rounded-md h-12 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-crBlue-200 sm:text-sm sm:leading-6"
                  {...register("email", { required: true })}
                />
              </div>
            </div>

            {errors.email && (
              <p className="text-sm leading-6 text-red-500 ">
                {errors.email.message}
              </p>
            )}

            {errors.password && (
              <p className="text-sm leading-6 text-red-500 ">
                {errors.password.message}
              </p>
            )}

            <div>
              <button
                type="submit"
                className="flex w-1/2 justify-center m-auto rounded-md bg-crBlue-200 px-2 py-3 text-base font-semibold leading-6 text-white hover:bg-crBlue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crBlue-600"
              >
                {loadingAuth ? <Loading /> : "Enviar"}
              </button>
            </div>
          </form>


            <div className="text-sm w-full flex justify-center">
              <Link
                to="/"
                className="font-semibold text-center text-slate-600 hover:text-slate-800 m-4"
              >
                Voltar para o início
              </Link>

          </div>
        </div>
      </div>
    </>
  );
}
