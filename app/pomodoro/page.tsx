"use client";

import { useState, useEffect, useCallback } from "react";
import {
  PauseIcon,
  PlayIcon,
  ArrowPathIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

export default function Pomodoro() {
  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [subject, setSubject] = useState("");
  const [isBreak, setIsBreak] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  const playAlarm = useCallback(() => {
    const audio = new Audio("/alarm.mp3"); // Adicione um arquivo de som de alarme na pasta public
    audio.play().catch((e) => console.log("Falha ao tocar áudio:", e));
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((time) => time - 1);
      }, 1000);
    } else if (time === 0) {
      setIsActive(false);
      playAlarm();
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 5000);

      if (!isBreak) {
        setIsBreak(true);
        setTime(5 * 60);
      } else {
        setIsBreak(false);
        setTime(25 * 60);
      }
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, time, isBreak, playAlarm]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Notification */}
      <Transition
        show={showNotification}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div className="fixed bottom-4 right-4 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3">
            <BellIcon className="h-5 w-5 text-blue-500" />
            <span className="text-gray-700">
              {isBreak ? "Hora do descanso!" : "Hora de voltar ao foco!"}
            </span>
          </div>
        </div>
      </Transition>

      {/* Cabeçalho */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              Timer Pomodoro
            </h1>
            <span className="text-blue-600 text-sm px-3 py-1 rounded-full bg-blue-50 border border-blue-100">
              {isBreak ? "Hora do Descanso" : "Hora do Foco"}
            </span>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cartão do Timer */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-transparent text-gray-900 text-center text-lg mb-8 
                     border-b border-gray-200 focus:border-blue-500 focus:outline-none 
                     placeholder:text-gray-400"
            placeholder="O que você vai estudar?"
          />

          {/* Display do Timer */}
          <div className="relative w-64 h-64 mx-auto mb-8">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-gray-100"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
              />
              <circle
                className="text-blue-500 transition-all duration-500"
                strokeWidth="6"
                stroke="currentColor"
                fill="transparent"
                r="120"
                cx="128"
                cy="128"
                strokeDasharray={2 * Math.PI * 120}
                strokeDashoffset={
                  2 * Math.PI * 120 * (1 - time / (isBreak ? 300 : 1500))
                }
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-5xl text-gray-900">
                {formatTime(time)}
              </span>
            </div>
          </div>

          {/* Controles */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className="p-4 rounded-full bg-black text-white hover:bg-gray-800 
                       transition-colors"
              title={isActive ? "Pausar" : "Iniciar"}
            >
              {isActive ? (
                <PauseIcon className="h-6 w-6" />
              ) : (
                <PlayIcon className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => {
                setIsActive(false);
                setIsBreak(false);
                setTime(25 * 60);
              }}
              className="p-4 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 
                       transition-colors"
              title="Reiniciar"
            >
              <ArrowPathIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Informação */}
          {subject && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Estudando: {subject}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
