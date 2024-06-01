import { Fragment, useEffect, useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilSquareIcon,
  CheckCircleIcon,
  MinusCircleIcon,
  ExclamationCircleIcon,
  PlusIcon,
  PhotoIcon,
  XMarkIcon,
  ArrowUpCircleIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Link, Outlet } from "react-router-dom";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

export default function Transmissoes() {
  return (
    <div className="p-5 min-h-screen">
      <div className="w-4/5 m-auto">
        <nav className="sm:hidden mb-2 m-auto" aria-label="Voltar">
          <Link
            to="/dashboard"
            className="flex items-center text-sm font-medium text-white hover:text-gray-700"
          >
            <ChevronLeftIcon
              className="-ml-1 mr-1 h-5 w-5 flex-shrink-0 text-gray-400"
              aria-hidden="true"
            />
            Voltar
          </Link>
        </nav>
        <nav className="hidden sm:flex mb-5" aria-label="Breadcrumb">
          <ol role="list" className="flex items-center space">
            <li>
              <div className="flex">
                <Link
                  to="/dashboard"
                  className="text-sm font-medium text-gray-100 hover:text-gray-300"
                >
                  Dashboard
                </Link>
              </div>
            </li>

            <li>
              <div className="flex">
                <ChevronRightIcon
                  className="h-5 w-5 flex-shrink-0 text-gray-400"
                  aria-hidden="true"
                />
                <Link
                  to="/dashboard/transmissoes"
                  className="text-sm font-medium text-gray-100 hover:text-gray-300"
                >
                  Transmissões
                </Link>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      {/* <div className="mt-2 md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold text-start leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
            Gerenciamento de transmissões
          </h2>
          <p className="mt-2 text-xs leading-6 text-gray-500 dark:text-slate-300 text-start">
            Página dedicada a criar, editar e excluir todas as transmissões da
            plataforma
          </p>
        </div>
        <div className="mt-4 flex flex-shrink-0 md:ml-4 md:mt-0"></div>

      </div> */}
      {/* <Header />  */}

      <main className="w-4/5 m-auto">
        <Tabs />
      </main>
    </div>
  );
}

const tabs = [
  { name: "Todas", count: "52", current: true },
  { name: "Próximas", count: "6", current: false },
  { name: "Passadas", count: "4", current: false },
];

const events = [
  {
    id: 1,
    name: "Mercado e CIA",
    date: "25 de abril",
    time: "11:30 AM",
    thumb: "https://i.ytimg.com/vi/VjaI9x0CZ24/maxresdefault.jpg",
  },
  {
    id: 2,
    name: "RN",
    date: "25 de abril",
    time: "08:30 PM",
    thumb:
      "https://i.ytimg.com/vi/tIXX9CrB7bg/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLAFDWcNQ0Hf7Czd2-6U7jh3pKvrkQ",
  },
  {
    id: 3,
    name: "Lance na TV",
    date: "25 de abril",
    time: "08:00 PM",
    thumb: "https://i.ytimg.com/vi/vkUL_ybHYBY/hqdefault.jpg",
  },
  {
    id: 4,
    name: "Leilão agrosolidário",
    date: "25 de abril",
    time: "09:00 PM",
    thumb:
      "https://imagens-cdn.canalrural.com.br/2024/05/yxTLj5OE-leilao-agro-solidario.jpg",
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Tabs() {
  const [tabSelected, setTabSelected] = useState("Todas");

  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Selecione uma opção
        </label>
        <select
          id="tabs"
          name="tabs"
          className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          defaultValue={tabSelected}
        >
          {tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>

        <div className="flex-shrink-0 w-full mt-2 flex justify-center">
          <button
            type="button"
            className="relative inline-flex items-center justify-center w-full gap-x-1.5 rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
          >
            <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Nova Transmissão
          </button>
        </div>
      </div>

      <div className="hidden sm:block">
        <div className="border-b border-gray-200 flex justify-between">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <Link
                key={tab.name}
                onClick={() => setTabSelected(tab.name)}
                className={classNames(
                  tab.name === tabSelected
                    ? "border-blue-500 text-blue-500"
                    : "border-transparent text-gray-600 hover:border-gray-100 hover:text-gray-200",
                  "flex whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium"
                )}
                aria-current={tab.current ? "page" : undefined}
              >
                {tab.name}
                {tab.count ? (
                  <span
                    className={classNames(
                      tab.name === tabSelected
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-900",
                      "ml-3 hidden rounded-full py-0.5 px-2.5 text-xs font-medium md:inline-block"
                    )}
                  >
                    {tab.count}
                  </span>
                ) : null}
              </Link>
            ))}
          </nav>
          <div className="flex-shrink-0">
            <button
              type="button"
              className="relative inline-flex items-center gap-x-1.5 rounded-md bg-blue-700 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" aria-hidden="true" />
              Nova Transmissão
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div id="cards" className="flex flex-col gap-4">
            {events.map((item) => (
              <div
                key={item.name}
                id="card"
                className="m-auto w-11/12 rounded-lg bg-crBlack-800 bg-opacity-40 flex"
              >
                <img
                  className="w-[250px] h-[150px] rounded-tl-lg rounded-bl-lg object-fill"
                  src={item.thumb}
                />

                <div className="flex w-full justify-between p-5">
                  <div className="flex flex-col">
                    <p className="text-xs font-extralight text-gray-100">{item.date} - {item.time}</p>
                    <h2 className="text-xl font-bold leading-7 text-white sm:truncate sm:text-2xl sm:tracking-tight">{item.name}</h2>
                  </div>

                  <div className="flex flex-col items-start gap-2 text-white">
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
