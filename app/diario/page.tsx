"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function DiaryPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    mood: "neutro",
  });
  const [entries] = useState<
    Array<{
      id: number;
      title: string;
      content: string;
      mood: string;
      created_at: string;
    }>
  >([]);
  const [loading] = useState(false);

  const getMoodEmoji = (mood: string) =>
    ({
      feliz: "😊",
      triste: "😢",
      neutro: "😐",
    }[mood]);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Minimal Header */}
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-2xl font-medium text-gray-900">Diário</h1>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsFormOpen(true)}
            className="p-2 rounded-full bg-black text-white"
          >
            <PlusIcon className="h-5 w-5" />
          </motion.button>
        </div>

        {/* Entries List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center py-12"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {entries.map((entry) => (
                <motion.article
                  key={entry.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                    <time className="text-sm text-gray-500">
                      {format(new Date(entry.created_at), "d 'de' MMMM", {
                        locale: ptBR,
                      })}
                    </time>
                  </div>
                  <h2 className="text-lg font-medium text-gray-900 mb-2">
                    {entry.title}
                  </h2>
                  <p className="text-gray-600 line-clamp-3">{entry.content}</p>
                </motion.article>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Minimal Modal Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-lg p-6 w-full max-w-md"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-medium text-gray-900">
                    Nova Entrada
                  </h2>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
                <form className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Título"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full px-0 border-0 border-b border-gray-200 placeholder-gray-400 focus:ring-0 focus:border-black"
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="O que você está pensando?"
                      value={formData.content}
                      onChange={(e) =>
                        setFormData({ ...formData, content: e.target.value })
                      }
                      rows={6}
                      className="w-full px-0 border-0 border-b border-gray-200 placeholder-gray-400 focus:ring-0 focus:border-black resize-none"
                    />
                  </div>
                  <div className="flex justify-center gap-4 pt-4">
                    {["feliz", "neutro", "triste"].map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            mood: mood as "feliz" | "neutro" | "triste",
                          })
                        }
                        className={`text-2xl p-2 rounded-full ${
                          formData.mood === mood
                            ? "bg-gray-100 scale-110"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        {getMoodEmoji(mood)}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-end pt-6">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded-full text-sm"
                    >
                      Salvar
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
