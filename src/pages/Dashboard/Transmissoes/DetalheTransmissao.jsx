/* eslint-disable no-unused-vars */
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Radio,
  RadioGroup,
} from "@headlessui/react";

import { SocialIcon } from "react-social-icons";
import {
  CalendarDaysIcon as CalendarIcon,
  EllipsisVerticalIcon,
  ExclamationCircleIcon,
  WifiIcon,
} from "@heroicons/react/20/solid";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import { useParams, useNavigate } from "react-router-dom";
import VideoPlayer from "@/videojs7/video";
import { useEffect, useState } from "react";
import { streaming } from "../../../services/stream";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import { formatDistance } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";

import cr from "@/assets/canalRuralColored.svg";
import cc from "@/assets/canalDoCriador.svg";
import lr from "@/assets/lanceRural.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const addEndPoint = yup.object({
  urlServidor: yup.string().required("Informe um servidor."),
  streamKey: yup.string().required("Adicionar uma streamkey"),
  endpointId: yup.string().required("Adicione um nome para a retransmissão"),
});

export default function DetalheTransmissao() {
  const navigate = useNavigate();

  const { idTransmissao } = useParams();
  const [transmissaoDados, setTransmissaoDados] = useState([]);
  const [qualidadeTransmissao, setQualidadeTransmissao] = useState([]);

  const [stats, setstats] = useState([]);
  const [dadosTransmissoes, setDadosTransmissoes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [openNewRestreaming, setOpenNewRestreaming] = useState(false);
  const [openDeleteStream, setOpenDeleteStream] = useState(false);
  const [mem, setMem] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTransmissaoDados([]);

    async function QualidadeTransmissao() {
      await streaming
        .get(`/alright/rest/v2/broadcasts/${idTransmissao}/stream-info`)
        .then((res) => {
          setQualidadeTransmissao(res.data);
        });
    }

    async function TransmissaoDados() {
      await streaming
        .get(`/alright/rest/v2/broadcasts/${idTransmissao}`)
        .then((res) => {
          setTransmissaoDados(res.data);
          setstats([
            {
              name: "Total de visualizações",
              value:
                res.data.hlsViewerCount +
                res.data.rtmpViewerCount +
                res.data.dashViewerCount,
            },
            {
              name: "HLS",
              value: res.data.hlsViewerCount,
            },
            {
              name: "RTMP",
              value: res.data.rtmpViewerCount,
            },
            {
              name: "DASH",
              value: res.data.dashViewerCount,
            },
          ]);

          const formatDate = formatDistance(res.data.startTime, new Date(), {
            locale: ptBR,
            includeSeconds: true,
          });
          
          setDadosTransmissoes([
            {
              urlStream: "URL Stream",
              rtmpCampo: res.data.rtmpURL,
            },
            {
              urlStream: "Origem",
              rtmpCampo: res.data.originAdress,
            },
            {
              urlStream: "Iniciado em",
              rtmpCampo: res.data.status !== 'broadcasting' ? 'Transmissão não iniciada' : formatDate,
            },
          ]);

          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }

    setInterval(() => {
      TransmissaoDados();
    }, [1000]);

    TransmissaoDados();
    QualidadeTransmissao();
  }, [idTransmissao]);

  async function handleDeleteRestream(endpointId) {
    await streaming
      .delete(
        `/alright/rest/v2/broadcasts/${idTransmissao}/rtmp-endpoint?endpointServiceId=${endpointId}`
      )
      .then((res) => {
        toast.success("Evento excluido com sucesso");
        if (res.status === 200) {
          navigate(0);
        }
      });
  }

  async function handleNewStream() {
    if (mem === "") {
      toast.error("Selecione um canal");
      return;
    }

    const dataEndpoint = {
      endpointServiceId: mem + " " + getValues("endpointId"),
      rtmpUrl: getValues("urlServidor") + "/" + getValues("streamKey"),
    };

    console.log(idTransmissao);

    await streaming
      .post(
        `/alright/rest/v2/broadcasts/${idTransmissao}/rtmp-endpoint`,
        dataEndpoint
      )
      .then((response) => {
        if (response.data.success === false) {
          toast.error(
            "URL Servidor não válido, por favor, veirique seus dados"
          );
          return;
        }

        toast.success("Retransmissão adicionado com sucesso");
        setMem("");
        setOpenNewRestreaming(false);
        reset();
      })
      .catch((error) => {
        toast.error("Alguma coisa deu errado, tente novamente");
        console.log(error);
      });
  }

  async function handleDeleteStream() {
    await streaming
      .delete(`/alright/rest/v2/broadcasts/${idTransmissao}`)
      .then((res) => {
        if (res.status === 200) {
          toast.success("Evento excluido com sucesso");
          navigate("/dashboard/transmissoes");
        }
      });
  }

  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addEndPoint),
  });

  return (
    <div className="min-h-screen">
      <header className="relative"></header>

      <main
        className="mx-auto max-w-2xl lg:max-w-7xl"
        aria-labelledby="manager-streaming-page"
      >
        {transmissaoDados && transmissaoDados ? (
          <>
            <div className="flex flex-col items-start justify-between gap-x-8 gap-y-4 bg-gray-700/10 px-4 py-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
              <div className="sm:w-0 sm:flex-1">
                <h1
                  id="message-heading"
                  className="text-2xl font-semibold leading-6 text-gray-100"
                >
                  {transmissaoDados.name}
                </h1>
                <p className="mt-1 truncate text-sm text-gray-300">
                  {transmissaoDados.description}
                </p>
              </div>

              <div className="">
                {transmissaoDados.status ? (
                  <span
                    className={classNames(
                      transmissaoDados.status === "broadcasting"
                        ? "bg-green-200 text-green-700 ring-green-600/20"
                        : "",
                      transmissaoDados.status === "finished"
                        ? "bg-red-200 text-red-700 ring-red-600/20"
                        : "",
                      transmissaoDados.status === "created"
                        ? "bg-yellow-200 text-yellow-700 ring-yellow-600/20"
                        : "",
                      transmissaoDados.status === "preparing"
                        ? "bg-yellow-200 text-yellow-700 ring-yellow-600/20"
                        : "",
                      "order-first flex-none rounded-full px-4 py-1 text-sm font-medium text-gray-100 ring-1 ring-inset ring-green-400 sm:order-none"
                    )}
                  >
                    {transmissaoDados.status === "created" ? "Criado" : ""}
                    {transmissaoDados.status === "finished" ? "Offline" : ""}
                    {transmissaoDados.status === "broadcasting" ? "Online" : ""}
                    {transmissaoDados.status === "preparing"
                      ? "Preparando"
                      : ""}
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 mb-10 bg-gray-700/10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, statIdx) => (
                <div
                  key={stat.name}
                  className={classNames(
                    statIdx % 2 === 1
                      ? "sm:border-l"
                      : statIdx === 2
                      ? "lg:border-l"
                      : "",
                    "border-t border-white/5 py-3 px-4 sm:px-6 lg:px-8"
                  )}
                >
                  <p className="text-xs sm:text-sm font-medium leading-6 text-gray-400">
                    {stat.name}
                  </p>
                  <p className="flex items-baseline">
                    <span className="text-xl sm:text-4xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </span>
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap mt-3 justify-center  items-center bg-gray-800 rounded-lg">
              <div className="flex-1">
                {transmissaoDados &&
                transmissaoDados.status !== "broadcasting" ? (
                  <img
                    className="p-4 my-auto"
                    src={
                      "https://www.shutterstock.com/shutterstock/videos/1110440069/thumb/8.jpg?ip=x480"
                    }
                  />
                ) : (
                  <VideoPlayer
                    streamId={transmissaoDados.streamId}
                    streamStatus={transmissaoDados.status}
                  />
                )}
              </div>

              <div>
                <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                  <div className=" flex-1 sm:px-6 lg:px-8">
                    <table className="flex-1">
                      <thead>
                        <tr>
                          <th scope="col" className="sr-only"></th>
                          <th scope="col" className="sr-only"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {dadosTransmissoes.map((data, index) => (
                          <tr
                            key={index}
                            className="even:bg-gray-900 odd:bg-gray-800"
                          >
                            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-3">
                              {data.urlStream}
                            </td>
                            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-200">
                              {data.rtmpCampo}
                            </td>
                          </tr>
                        ))}
                        <tr
                          key={dadosTransmissoes.length + 1}
                          className="even:bg-gray-900 odd:bg-gray-800"
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-100 sm:pl-3">
                            Qualidades disponíveis
                          </td>

                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-200 text-center flex">
                            {qualidadeTransmissao.map((qualidade) => (
                              <span
                                key={qualidade.videoHeight}
                                className="bg-red-200 text-red-700 ring-red-600/20 m-1 p-1 px-3 rounded-lg"
                              >
                                {qualidade.videoHeight}p
                              </span>
                            ))}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="grid min-w-full bg-gray-900 bg-opacity-60 py-3 px-5 rounded-lg">
                <div className="p-2 pb-4">
                  <div className="sm:flex sm:items-baseline sm:justify-between">
                    <div className="sm:w-0 sm:flex-1">
                      <h1
                        id="message-heading"
                        className="text-2xl font-semibold leading-6 text-gray-100"
                      >
                        Retransmissões
                      </h1>
                      <p className="mt-1 truncate text-sm text-gray-300">
                        Gerencia suas retransmissões aqui
                      </p>
                    </div>

                    {/* SECAO RETRANSMISSOES */}
                    <div className="mt-3 sm:ml-4 sm:mt-0">
                      <button
                        type="button"
                        onClick={() => setOpenNewRestreaming(true)}
                        className="inline-flex items-center w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                      >
                        Nova retransmissão
                      </button>
                    </div>
                  </div>
                </div>

                <ul
                  role="list"
                  className="grid grid-cols-1 gap-6 sm:grid-cols-1 lg:grid-cols-1"
                >
                  {transmissaoDados.endPointList &&
                  transmissaoDados.endPointList.length > 0 ? (
                    transmissaoDados.endPointList.map((retrans) => (
                      <li
                        key={retrans.endpointServiceId}
                        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-gray-900 shadow"
                      >
                        <div className="flex w-full items-center justify-between space-x-2 sm:space-x-5 py-3 px-3">
                          {retrans.endpointServiceId.match(
                            "Provider-Facebook"
                          ) ? (
                            <SocialIcon network="facebook" />
                          ) : (
                            <></>
                          )}

                          {retrans.endpointServiceId.match(
                            "Provider-Youtube"
                          ) ? (
                            <SocialIcon network="youtube" />
                          ) : (
                            <></>
                          )}

                          {retrans.endpointServiceId.match(
                            "Provider-Custom"
                          ) ? (
                            <span className="bg-gray-100 px-3 py-2 rounded-full">
                              <h3 className="text-2xl text-extrabold">C</h3>
                            </span>
                          ) : (
                            <></>
                          )}
                          <div className="flex-1 truncate">
                            <div className="flex items-center space-x-3">
                              <h3 className="truncate text-lg font-medium text-gray-100">
                                {retrans.endpointServiceId.match(
                                  "Provider-Youtube "
                                ) ? (
                                  retrans.endpointServiceId.split(
                                    "Provider-Youtube"
                                  )
                                ) : (
                                  <></>
                                )}

                                {retrans.endpointServiceId.match(
                                  "Provider-Facebook "
                                ) ? (
                                  retrans.endpointServiceId.split(
                                    "Provider-Facebook"
                                  )
                                ) : (
                                  <></>
                                )}

                                {retrans.endpointServiceId.match(
                                  "Provider-Custom "
                                ) ? (
                                  retrans.endpointServiceId.split(
                                    "Provider-Custom"
                                  )
                                ) : (
                                  <></>
                                )}
                              </h3>

                              <div>
                                {retrans.status === "broadcasting" ? (
                                  <WifiIcon
                                    className="h-5 w-5 text-green-500"
                                    aria-hidden="true"
                                  />
                                ) : (
                                  <ExclamationCircleIcon
                                    className="h-5 w-5 text-red-400"
                                    aria-hidden="true"
                                  />
                                )}
                              </div>
                            </div>
                            <p className="mt-1 text-ellipsis text-sm text-gray-500">
                              {retrans.rtmpUrl}
                            </p>
                          </div>
                          <Menu
                            as="div"
                            className="relative ml-3 inline-block text-left"
                          >
                            <div>
                              <MenuButton className="-my-2 flex items-center rounded-full bg-gray-800 p-2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500">
                                <span className="sr-only">Open options</span>
                                <EllipsisVerticalIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </MenuButton>
                            </div>

                            <Transition
                              enter="transition ease-out duration-100"
                              enterFrom="transform opacity-0 scale-95"
                              enterTo="transform opacity-100 scale-100"
                              leave="transition ease-in duration-75"
                              leaveFrom="transform opacity-100 scale-100"
                              leaveTo="transform opacity-0 scale-95"
                            >
                              <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                <div className="py-1">
                                  <MenuItem>
                                    {({ focus }) => (
                                      <button
                                        onClick={() =>
                                          handleDeleteRestream(
                                            retrans.endpointServiceId
                                          )
                                        }
                                        className={classNames(
                                          focus
                                            ? "bg-gray-100 text-gray-900"
                                            : "text-gray-700",
                                          "flex justify-between px-4 py-2 text-sm w-full"
                                        )}
                                      >
                                        <span>Excluir</span>
                                      </button>
                                    )}
                                  </MenuItem>
                                  {/* <MenuItem>
                                      {({ focus }) => (
                                        <a
                                          href="#"
                                          className={classNames(
                                            focus
                                              ? "bg-gray-100 text-gray-900"
                                              : "text-gray-700",
                                            "flex justify-between px-4 py-2 text-sm"
                                          )}
                                        >
                                          <span>Excluir</span>
                                        </a>
                                      )}
                                    </MenuItem> */}
                                </div>
                              </MenuItems>
                            </Transition>
                          </Menu>
                        </div>
                      </li>
                    ))
                  ) : (
                    <div className="rounded-xl w-4/6 m-auto flex items-center flex-col p-10">
                      <h3 className="text-xl text-gray-200">
                        Não existem retransmissões programadas
                      </h3>
                      <CalendarIcon className="w-16 h-16 mt-4 text-gray-200" />
                    </div>
                  )}
                </ul>

                <Transition show={openNewRestreaming}>
                  <Dialog
                    className="relative z-10"
                    onClose={setOpenNewRestreaming}
                  >
                    <TransitionChild
                      enter="ease-out duration-300"
                      enterFrom="opacity-0"
                      enterTo="opacity-100"
                      leave="ease-in duration-200"
                      leaveFrom="opacity-100"
                      leaveTo="opacity-0"
                    >
                      <div className="fixed inset-0 bg-gray-500 bg-opacity-60 transition-opacity" />
                    </TransitionChild>

                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                      <div className="flex min-h-full items-center justify-center p-4 text-center sm:items-center sm:p-0">
                        <TransitionChild
                          enter="ease-out duration-300"
                          enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                          enterTo="opacity-100 translate-y-0 sm:scale-100"
                          leave="ease-in duration-200"
                          leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                          leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                          <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                            <div className="sm:flex sm:items-start">
                              <div className="mt-3 text-left sm:ml-4 sm:mt-0 sm:text-left">
                                <DialogTitle
                                  as="h3"
                                  className="text-xl font-semibold leading-6 text-gray-900"
                                >
                                  Adicione os dados necessários para uma nova
                                  retransmissão
                                </DialogTitle>
                                <form
                                  className="space-y-6 mt-6"
                                  onSubmit={handleSubmit(handleNewStream)}
                                >
                                  <div>
                                    <RadioGroup
                                      value={mem}
                                      onChange={setMem}
                                      className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-3"
                                    >
                                      <Radio
                                        value="Provider-Youtube"
                                        className={({ focus, checked }) =>
                                          classNames(
                                            focus
                                              ? "ring-2 ring-green-600 ring-offset-2"
                                              : "",
                                            checked
                                              ? "bg-green-100 text-gray-900 hover:bg-green-200"
                                              : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                                            "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                                          )
                                        }
                                      >
                                        <SocialIcon network="youtube" bgColor="black"/>
                                      </Radio>

                                      <Radio
                                        value="Provider-Facebook"
                                        className={({ focus, checked }) =>
                                          classNames(
                                            focus
                                              ? "ring-2 ring-green-600 ring-offset-2"
                                              : "",
                                            checked
                                              ? "bg-green-100 text-gray-900 hover:bg-green-200"
                                              : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                                            "flex items-center justify-center rounded-md font-semibold text-center sm:flex-1 cursor-pointer"
                                          )
                                        }
                                      >
                                        <SocialIcon
                                          network="facebook"
                                          bgColor="black"

                                        />
                                      </Radio>

                                      <Radio
                                        value="Provider-Custom"
                                        className={({ focus, checked }) =>
                                          classNames(
                                            focus
                                              ? "ring-2 ring-green-600 ring-offset-2"
                                              : "",
                                            checked
                                              ? "bg-green-100 text-gray-900 hover:bg-green-200"
                                              : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                                            "flex items-center justify-center rounded-md text-lg py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                                          )
                                        }
                                      >
                                        Custom
                                      </Radio>
                                    </RadioGroup>

                                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                      <div className="sm:col-span-6">
                                        <label
                                          htmlFor="username"
                                          className="block text-sm font-medium leading-6 text-gray-900"
                                        >
                                          Identificação da retransmissão
                                        </label>
                                        <div className="mt-2">
                                          <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 ">
                                            <input
                                              type="text"
                                              name="endpointId"
                                              id="endpointId"
                                              autoComplete="endpointId"
                                              placeholder="* obrigatório"
                                              className="inline flex-1 border-1 border-gray-200 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 placeholder:text-xs focus:ring-0 sm:text-sm sm:leading-6"
                                              {...register("endpointId", {
                                                required: true,
                                              })}
                                            />
                                          </div>
                                          {errors.endpointId && (
                                            <p className="text-xs mt-2 text-red-400 ">
                                              {errors.endpointId.message}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                      <label
                                        htmlFor="username"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                      >
                                        URL Servidor
                                      </label>
                                      <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 ">
                                          <input
                                            type="text"
                                            name="urlServidor"
                                            id="urlServidor"
                                            autoComplete="urlServidor"
                                            placeholder="Ex: rtmp://a.rtmp.youtube.com/live2/"
                                            className="inline flex-1 border-1 border-gray-200 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 placeholder:text-xs focus:ring-0 sm:text-sm sm:leading-6"
                                            {...register("urlServidor", {
                                              required: true,
                                            })}
                                          />
                                        </div>
                                        {errors.urlServidor && (
                                          <p className="text-xs mt-2 text-red-400 ">
                                            {errors.urlServidor.message}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                    <div className="sm:col-span-6">
                                      <label
                                        htmlFor="username"
                                        className="block text-sm font-medium leading-6 text-gray-900"
                                      >
                                        Chave da transmissão
                                      </label>
                                      <div className="mt-2">
                                        <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-gray-600 ">
                                          <input
                                            type="text"
                                            name="streamKey"
                                            id="streamKey"
                                            autoComplete="streamKey"
                                            placeholder="* Ex: q9uz-7rde-4r2h-yw34-8q7p"
                                            className="inline flex-1 border-1 border-gray-200 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 placeholder:text-xs focus:ring-0 sm:text-sm sm:leading-6"
                                            {...register("streamKey", {
                                              required: true,
                                            })}
                                          />
                                        </div>
                                        {errors.streamKey && (
                                          <p className="text-xs mt-2 text-red-400 ">
                                            {errors.streamKey.message}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
                                    <button
                                      type="submit"
                                      className="mt-3 inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-500 sm:mt-0 sm:w-auto"
                                    >
                                      Adicionar
                                    </button>
                                    <button
                                      type="button"
                                      className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                                      onClick={() =>
                                        setOpenNewRestreaming(false)
                                      }
                                      data-autofocus
                                    >
                                      Cancelar
                                    </button>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </DialogPanel>
                        </TransitionChild>
                      </div>
                    </div>
                  </Dialog>
                </Transition>

                {/* FIM SECAO RETRANSMISSAO */}
              </div>
            </div>
          </>
        ) : (
          <></>
        )}

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => setOpenDeleteStream(true)}
            className="inline-flex items-center w-6/12 mx-auto justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
          >
            Excluir
          </button>

          <Transition show={openDeleteStream}>
            <Dialog className="relative z-10" onClose={setOpenDeleteStream}>
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-gray-500 bg-opacity-40 transition-opacity" />
              </TransitionChild>

              <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <TransitionChild
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <DialogPanel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <ExclamationTriangleIcon
                            className="h-6 w-6 text-red-600"
                            aria-hidden="true"
                          />
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <DialogTitle
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Excluir sinal de entrada
                          </DialogTitle>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Esta é uma operação que não tem mais retorno, uma
                              vez que confirmado, o sinal de entrada e todas as
                              retransmissões cadastrada nela serão excluídas
                              para sempre.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-red-600 text-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-red-300 hover:bg-red-500 sm:mt-0 sm:w-auto"
                          onClick={handleDeleteStream}
                          data-autofocus
                        >
                          Excluir
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setOpenDeleteStream(false)}
                          data-autofocus
                        >
                          Cancelar
                        </button>
                      </div>
                    </DialogPanel>
                  </TransitionChild>
                </div>
              </div>
            </Dialog>
          </Transition>
        </div>
      </main>

      <footer aria-labelledby="footer-heading" className="bg-gray-50"></footer>
    </div>
  );
}
