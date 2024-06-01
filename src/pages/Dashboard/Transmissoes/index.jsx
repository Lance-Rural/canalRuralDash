import {
  BriefcaseIcon,
  CalendarIcon,
  CheckIcon,
  CurrencyDollarIcon,
  MapPinIcon,
  PhoneIcon,
  VideoCameraIcon,
} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import VideoPlayer from "@/videojs/video";
import { useEffect, useState } from "react";
import { streaming } from "../../../services/stream";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration'

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

dayjs.extend(duration)

export default function Transmissoes() {
  const [streamingList, setStreamingList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    async function list() {
      await streaming
        .get("/alright/rest/v2/broadcasts/list/0/10")
        .then((res) => {
          // console.log(res.data);
          setIsLoading(false);
          setStreamingList(res.data);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }

    setInterval(() => {
      list();
    }, [1000]);

    // list();
  }, []);

  function formatDate(e) {
    // console.log(e)
    return 1;
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
                {streamingList && streamingList.length} sinais de entrada
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
            <span className="">
              <button
                type="button"
                className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
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
                          <dd className="text-sm text-gray-500">
                            Duração de : <span>{dayjs.duration(transmissao.duration).minutes()}</span>
                          </dd>

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
                              href={`mailto:${transmissao.email}`}
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
