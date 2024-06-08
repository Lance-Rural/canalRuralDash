import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Radio,
  RadioGroup,
} from "@headlessui/react";

import {
  CheckIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import VideoPlayer from "@/videojs7/video";
import { useEffect, useState } from "react";
import { streaming } from "../../../services/stream";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";

import cr from "@/assets/canalRuralColored.svg";
import cc from "@/assets/canalDoCriador.svg";
import lr from "@/assets/lanceRural.svg";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const addNewEvent = yup.object({
  name: yup.string().required("É necessário um nome para o evento."),
  description: yup.string().required("Adicione uma breve descrição."),
});

export default function Transmissoes() {
  const [streamingList, setStreamingList] = useState([]);
  const [streamingListCounter, setStreamingListCounter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [radioSelected, setRadioSelected] = useState("");

  useEffect(() => {
    setIsLoading(true);

    async function listCounter() {
      await streaming.get("/alright/rest/v2/broadcasts/count").then((res) => {
        const responseTotalCounter = res.data.number;
        setStreamingListCounter(responseTotalCounter);
        list(responseTotalCounter);
      });
    }

    async function list(total) {
      await streaming
        .get(`/alright/rest/v2/broadcasts/list/0/${total}`)
        .then((res) => {
          setStreamingList(res.data);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }

    listCounter();
  }, []);

  

  function openModal() {
    setOpenDialog(!openDialog);
  }

  return (
    <div className="min-h-screen p-10">
      <header className="relative">
        <div className="lg:flex lg:items-center lg:justify-between w-full">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl mb-3 sm:tracking-tight">
              Gerenciamento de sinais
            </h2>
            <div className="mt-1 flex flex-col gap-2 justify-between w-full items-center sm:mt-0 sm:flex-row sm:flex-wrap">
              {/* <div className="mt-2 flex items-center text-sm text-gray-300">
                <BriefcaseIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                {streamingListCounter && streamingListCounter} sinais de entrada
              </div> */}

              <div className="w-full md:w-8/12">
                <RadioGroup
                  value={radioSelected}
                  // onChange={}
                  className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-3"
                >
                  <Radio
                    value="Canal Rural"
                    className={({ focus, checked }) =>
                      classNames(
                        focus ? "ring-2 ring-green-600 ring-offset-2" : "",
                        checked
                          ? "bg-green-100 text-white hover:bg-green-200"
                          : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                        "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                      )
                    }
                  >
                    <img src={cr} className="w-24" />
                  </Radio>

                  <Radio
                    value="Canal Do Criador"
                    className={({ focus, checked }) =>
                      classNames(
                        focus ? "ring-2 ring-green-600 ring-offset-2" : "",
                        checked
                          ? "bg-green-100 text-white hover:bg-green-200"
                          : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                        "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                      )
                    }
                  >
                    <img src={cc} className="w-14" />
                  </Radio>

                  <Radio
                    value="Lance Rural"
                    className={({ focus, checked }) =>
                      classNames(
                        focus ? "ring-2 ring-green-600 ring-offset-2" : "",
                        checked
                          ? "bg-green-100 text-white hover:bg-green-200"
                          : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                        "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                      )
                    }
                  >
                    <img src={lr} className="w-14" />
                  </Radio>
                </RadioGroup>
              </div>
              <button
                type="submit"
                onClick={openModal}
                className="inline-flex items-center justify-center h-12 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500 w-full md:w-3/12"
              >
                <CheckIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Nova transmissão
              </button>
            </div>
          </div>
          <div className="mt-5 flex lg:ml-4 lg:mt-0">
            <span>
              {/* <button
                type="submit"
                onClick={openModal}
                className="inline-flex items-center h-16 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-500"
              >
                <CheckIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Nova transmissão
              </button> */}
            </span>
          </div>
        </div>
      </header>

      <main
        aria-labelledby="manager-streaming-page"
      >
        {openDialog ? <DialogNewEvent /> : <></>}

        {isLoading ? (
          <h1 className="text-white">loading...</h1>
        ) : (
          <div>
            {streamingList && (
              <ul
                role="list"
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-3"
              >
                {streamingList.map((transmissao) => (
                  <li
                    key={transmissao.streamId}
                    className="col-span-1 flex flex-col divide-y divide-gray-200 rounded-lg bg-white text-left shadow"
                  >
                    <div className="flex flex-1 flex-col pt-3 ">
                      <VideoPlayer
                        channelName={transmissao.channelFullName}
                        thumb={transmissao.thumb}
                        streamId={transmissao.streamId}
                        streamStatus={transmissao.status}
                      />
                      <div className="px-4 mt-2">
                        <span
                          className={classNames(
                            transmissao.status === "broadcasting"
                              ? "bg-green-50 text-green-700 ring-green-600/20"
                              : "",
                            transmissao.status === "finished"
                              ? "bg-red-50 text-red-700 ring-red-600/20"
                              : "",
                            transmissao.status === "created"
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                              : "",
                            transmissao.status === "preparing"
                              ? "bg-yellow-50 text-yellow-700 ring-yellow-600/20"
                              : "",
                            "inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset"
                          )}
                        >
                          {transmissao.status === "created" ? "Criado" : ""}
                          {transmissao.status === "finished" ? "Offline" : ""}
                          {transmissao.status === "broadcasting"
                            ? "Online"
                            : ""}
                          {transmissao.status === "preparing"
                            ? "Preparando"
                            : ""}
                        </span>

                        <div>
                          {transmissao.category === null ? "" : <></>}

                          {transmissao.category === "Lance Rural" ? (
                            <img src={lr} className="w-10 my-2" />
                          ) : (
                            ""
                          )}

                          {transmissao.category === "Canal Rural" ? (
                            <img src={cr} className="w-20 my-2" />
                          ) : (
                            ""
                          )}

                          {transmissao.category === "Canal Do Criador" ? (
                            <img src={cc} className="w-10 my-2" />
                          ) : (
                            ""
                          )}
                        </div>

                        <h3 className="mt-2 text-base font-medium text-gray-900">
                          {transmissao.name}
                        </h3>

                        <dl className="mt-1 mb-2 flex flex-grow flex-col justify-between">
                          <dd className="text-sm text-gray-500">
                            Speed: {transmissao.speed}
                          </dd>

                          <dd className="text-sm text-gray-500">
                            Origem: {transmissao.originAdress}
                          </dd>
                        </dl>
                      </div>
                      <div>
                        <div className="-mt-px flex divide-x divide-gray-200">
                          <div className="flex w-0 flex-1">
                            <Link
                              to={`/dashboard/transmissoes/${transmissao.streamId}`}
                              className="relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold text-gray-900"
                            >
                              <VideoCameraIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                              />
                              Acessar
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>

      <footer aria-labelledby="footer-heading" className="bg-gray-50"></footer>
    </div>
  );
}

export function DialogNewEvent(openDialog) {
  const [open, setOpen] = useState(openDialog);
  const [radioSelected, setRadioSelected] = useState("");

  async function handleNewEvent() {
    console.log("Novo evento criado com sucesso");

    if (radioSelected === "") {
      toast.error("É preciso selecionar o canal da transmissão");
      return;
    }

    const data = {
      name: getValues("name"),
      description: getValues("description"),
      type: "liveStream",
      category: radioSelected,
      publishType: "RTMP",
    };

    await streaming
      .post(`/alright/rest/v2/broadcasts/create`, data)
      .then(() => {
        toast.success("Evento criado com sucesso");
        setOpen(false);
      });

    console.log(data);
  }

  const {
    handleSubmit,
    register,
    getValues,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(addNewEvent),
  });

  return (
    <Transition show={open}>
      <Dialog className="relative z-10" onClose={setOpen}>
        <TransitionChild
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
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
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <DialogTitle
                      as="h3"
                      className="text-xl font-semibold leading-6 text-gray-900 mb-2 text-center mx-auto"
                    >
                      Criando uma nova transmissão
                    </DialogTitle>
                  </div>
                </div>
                <div className="p-2">
                  <form
                    className="space-y-6"
                    onSubmit={handleSubmit(handleNewEvent)}
                  >
                    <div>
                      <input
                        autoComplete="name"
                        className="relative block w-full rounded-md h-10 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-crBlue-200 sm:text-sm sm:leading-6"
                        placeholder="Digite um nome para o evento"
                        {...register("name", {
                          required: true,
                        })}
                      />
                      {errors.name && (
                        <p className="text-xs mt-2 text-red-400 ">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <textarea
                        autoComplete="description"
                        rows={10}
                        className="relative block w-full rounded-md h-24 border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-crBlue-200 sm:text-sm sm:leading-6"
                        placeholder="Digite uma breve descrição sobre o evento"
                        {...register("description", {
                          required: true,
                        })}
                      />
                      {errors.description && (
                        <p className="text-xs mt-2 text-red-400 ">
                          {errors.description.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <RadioGroup
                        value={radioSelected}
                        onChange={setRadioSelected}
                        className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-3"
                      >
                        <Radio
                          value="Canal Rural"
                          className={({ focus, checked }) =>
                            classNames(
                              focus
                                ? "ring-2 ring-green-600 ring-offset-2"
                                : "",
                              checked
                                ? "bg-green-100 text-white hover:bg-green-200"
                                : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                              "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                            )
                          }
                        >
                          <img src={cr} className="w-20" />
                        </Radio>

                        <Radio
                          value="Canal Do Criador"
                          className={({ focus, checked }) =>
                            classNames(
                              focus
                                ? "ring-2 ring-green-600 ring-offset-2"
                                : "",
                              checked
                                ? "bg-green-100 text-white hover:bg-green-200"
                                : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                              "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                            )
                          }
                        >
                          <img src={cc} className="w-14" />
                        </Radio>

                        <Radio
                          value="Lance Rural"
                          className={({ focus, checked }) =>
                            classNames(
                              focus
                                ? "ring-2 ring-green-600 ring-offset-2"
                                : "",
                              checked
                                ? "bg-green-100 text-white hover:bg-green-200"
                                : "ring-1 ring-inset ring-gray-300 bg-white text-gray-900 hover:bg-gray-50",
                              "flex items-center justify-center rounded-md text-xs py-3 font-semibold text-center sm:flex-1 cursor-pointer"
                            )
                          }
                        >
                          <img src={lr} className="w-14" />
                        </Radio>
                      </RadioGroup>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="inline-flex w-full justify-center rounded-md bg-green-600 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-green-500 w-4/12"
                        data-autofocus
                      >
                        Adicionar
                      </button>

                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-red-500 w-2/12"
                        data-autofocus
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
