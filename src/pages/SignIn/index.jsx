import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { useAuth } from "@/hooks/useAuth";

import { Loading } from "@/components/Loading";

import { Link } from "react-router-dom";

import logo from "@/assets/canalRural.svg";

const signInSchema = yup.object({
  email: yup
    .string()
    .required("Informe o e-mail.")
    .email("É necessário um email válido."),
  password: yup.string().required("Informe a senha."),
});

export default function SignIn() {
  const { signIn, loadingAuth } = useAuth();

  const {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  function handleSignIn() {
    signIn(getValues("email"), getValues("password"));
  }

  return (
    <>
      <div className="flex min-h-full flex-1 min-h-screen bg-gradient-to-l from-gray-900 to-gray-800 ">
        <div className="flex flex-1 flex-col justify-center px- py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                className="h-10 w-auto sm:m-auto"
                src={logo}
                alt="Your Company"
              />
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-200">
                Faça o login em sua conta
              </h2>
              <p className="mt-2 text-sm leading-6 text-gray-400">
                Acesso somente a pessoas autorizada
              </p>
            </div>

            <div className="mt-10">
              <div>
              <form className="space-y-6" onSubmit={handleSubmit(handleSignIn)}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-300"
                    >
                      Email
                    </label>
                    <div className="mt-2">
                      <input
                        autoComplete="email"
                        className="relative block w-full rounded-md h-12 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-crBlue-200 sm:text-sm sm:leading-6"
                        placeholder="Digite seu email"
                        {...register("email", { required: true })}
                      />
                      {errors.email && (
                        <p className="text-xs mt-2 text-red-400 ">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                  <label
                      htmlFor="senha"
                      className="block text-sm font-medium leading-6 text-gray-300"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      autoComplete="password"
                      className="relative block w-full rounded-md h-12 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-crBlue-200 sm:text-sm sm:leading-6"
                      placeholder="Digite sua senha"
                      {...register("password", { required: true })}
                    />
                    {errors.password && (
                      <p className="text-xs mt-2 text-red-400 ">
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm leading-6">
                      <Link
                        to="/resetPassword"
                        className="font-semibold text-slate-400 hover:text-slate-300"
                      >
                        Esqueceu sua senha?
                      </Link>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-4/5 justify-center m-auto rounded-md bg-crBlue-200 px-2 py-2 text-base font-semibold leading-6 text-white hover:bg-crBlue-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-crBlue-600"
                    >
                      {loadingAuth ? <Loading /> : "Acessar"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.pexels.com/photos/1382102/pexels-photo-1382102.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt=""
          />
        </div>
      </div>
    </>
  );
}
