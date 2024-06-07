import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import VideoPlayer from "@/videojs/video";
import { useEffect, useState } from "react";
import { streaming } from "../../../services/stream";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Transmissoes() {
  const [streamingList, setStreamingList] = useState([]);
  const [streamingListCounter, setStreamingListCounter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    async function listCounter() {
      await streaming.get("/alright/rest/v2/broadcasts/count").then((res) => {
        const responseTotalCounter = res.data.number.toString();
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

    setInterval(() => {
      listCounter();
    }, [2000]);

    listCounter();
  }, []);

  function openModal() {
    setOpenDialog(!openDialog);
  }

  return (
    <div className="min-h-screen p-10">
      <header className="relative">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-bold leading-7 text-white sm:truncate sm:text-3xl sm:tracking-tight">
              Gerenciamento de sinais
            </h2>
            <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
              <div className="mt-2 flex items-center text-sm text-gray-300">
                <BriefcaseIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                {streamingListCounter && streamingListCounter} sinais de entrada
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-300">
                <MapPinIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                Remote
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-300">
                <CurrencyDollarIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                $120k – $140k
              </div>
              <div className="mt-2 flex items-center text-sm text-gray-300">
                <CalendarIcon
                  className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-500"
                  aria-hidden="true"
                />
                Closing on January 9, 2020
              </div>
            </div>
          </div>
          <div className="mt-5 flex lg:ml-4 lg:mt-0">
            <span>
              <button
                type="submit"
                onClick={openModal}
                className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
              >
                <CheckIcon
                  className="-ml-0.5 mr-1.5 h-5 w-5"
                  aria-hidden="true"
                />
                Nova transmissão
              </button>
            </span>
          </div>
        </div>
      </header>

      <main
        className="mx-auto max-w-2xl lg:max-w-7xl "
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
                className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 mt-5"
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
                        <h3 className="mt-2 text-sm font-medium text-gray-900">
                          {transmissao.name}
                        </h3>
                        <dl className="mt-1 mb-2 flex flex-grow flex-col justify-between">
                          <dt className="sr-only">Nome Canal</dt>
                          <dd className="text-sm text-gray-500">
                            Speed: {transmissao.speed}
                          </dd>

                          <dt className="sr-only">Nome Canal</dt>
                          {/* <dd className="text-sm text-gray-500">
                            Iniciado:{" "}
                            <span>
                              {getTime(transmissao.date)}

                              {console.log(transmissao.date)}
                            </span>
                          </dd> */}

                          <dt className="sr-only">Nome Canal</dt>
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
                              className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-3 text-sm font-semibold text-gray-900"
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
  console.log(openDialog);

  const [open, setOpen] = useState(openDialog);

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
                      Deactivate account
                    </DialogTitle>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed from our servers
                        forever. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                    onClick={() => setOpen(false)}
                  >
                    Criar
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
                    onClick={() => setOpen(false)}
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
  );
}
