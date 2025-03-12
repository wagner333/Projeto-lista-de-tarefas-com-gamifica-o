"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  BellIcon,
  PlusIcon,
  CheckIcon,
  XMarkIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

interface Reminder {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  priority: "low" | "medium" | "high";
  status: "pending" | "completed" | "canceled";
  recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly";
  recurrence_config: unknown[];
  all_day: boolean;
  notifications: unknown[];
  location: string;
  attachments: unknown[];
  color: string;
}

export default function RemindersPage() {
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
    priority: "medium",
    status: "pending",
    recurrence: "none",
    all_day: false,
    location: "",
    color: "#4f46e5", // Default indigo color
  });
  const [filter, setFilter] = useState<"all" | "upcoming" | "overdue">("all");

  const fetchReminders = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const endpoint =
        filter === "all"
          ? "/reminders"
          : filter === "upcoming"
          ? "/reminders-upcoming"
          : "/reminders-overdue";

      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch reminders");
      }

      const data = await response.json();
      setReminders(data.data || []);
    } catch (error) {
      console.error("Erro ao buscar lembretes:", error);
    } finally {
      setLoading(false);
    }
  }, [filter, router]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const handleCreateReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://taskmaster.hsyst.xyz/api/reminders",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setIsFormOpen(false);
        setFormData({
          title: "",
          description: "",
          start_date: "",
          end_date: "",
          priority: "medium",
          status: "pending",
          recurrence: "none",
          all_day: false,
          location: "",
          color: "#4f46e5",
        });
        fetchReminders();
      } else {
        const errorData = await response.json();
        console.error(errorData.message || "Erro ao criar lembrete");
      }
    } catch {
      console.error("Erro ao criar lembrete");
    }
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority as keyof typeof colors];
  };

  // Group reminders by date
  const groupedReminders = reminders.reduce(
    (groups: { [key: string]: Reminder[] }, reminder) => {
      const date = new Date(reminder.start_date).toLocaleDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(reminder);
      return groups;
    },
    {}
  );

  // Sort reminders by priority and time
  const sortReminders = (reminders: Reminder[]) => {
    return reminders.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      if (a.priority !== b.priority) {
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      }
      return (
        new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
      );
    });
  };

  // Format time in a more readable way
  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleComplete = async (reminderId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/reminders/${reminderId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to complete reminder");
      }

      // Update the local state
      setReminders((prev) =>
        prev.map((reminder) =>
          reminder.id === reminderId
            ? { ...reminder, status: "completed" }
            : reminder
        )
      );

      toast.success("Lembrete marcado como concluído!");
    } catch (error) {
      console.error("Error completing reminder:", error);
      toast.error("Erro ao concluir o lembrete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-medium text-gray-900">Lembretes</h1>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-100 rounded-lg p-0.5">
                {["all", "upcoming", "overdue"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f as typeof filter)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      filter === f
                        ? "bg-white shadow text-gray-900"
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {f === "all"
                      ? "Todos"
                      : f === "upcoming"
                      ? "Próximos"
                      : "Atrasados"}
                  </button>
                ))}
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsFormOpen(true)}
                className="bg-black text-white p-2 rounded-full"
              >
                <PlusIcon className="h-5 w-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Simplified Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
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
              className="space-y-8"
            >
              {Object.entries(groupedReminders).map(([date, reminders]) => (
                <motion.section
                  key={date}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-2"
                >
                  <h2 className="text-sm font-medium text-gray-500 sticky top-16 bg-gray-50 py-2">
                    {new Date(date).toLocaleDateString("pt-BR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h2>
                  <div className="space-y-1">
                    {sortReminders(reminders).map((reminder) => (
                      <motion.div
                        key={reminder.id}
                        layout
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="p-4 flex items-start gap-4">
                          <div
                            className="w-1 self-stretch rounded-full"
                            style={{ backgroundColor: reminder.color }}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              {!reminder.all_day && (
                                <span className="text-sm text-gray-400">
                                  {formatTime(reminder.start_date)}
                                </span>
                              )}
                              <h3 className="text-base font-medium text-gray-900">
                                {reminder.title}
                              </h3>
                            </div>
                            {reminder.description && (
                              <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                                {reminder.description}
                              </p>
                            )}
                            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-gray-500">
                              {reminder.location && (
                                <span className="flex items-center gap-1">
                                  <MapPinIcon className="h-3.5 w-3.5" />
                                  {reminder.location}
                                </span>
                              )}
                              {reminder.recurrence !== "none" && (
                                <span className="flex items-center gap-1">
                                  <BellIcon className="h-3.5 w-3.5" />
                                  {reminder.recurrence}
                                </span>
                              )}
                              <span
                                className={`px-2 py-0.5 rounded-full font-medium ${getPriorityColor(
                                  reminder.priority
                                )}`}
                              >
                                {reminder.priority}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleComplete(reminder.id)}
                              className={`p-1 rounded-full hover:bg-gray-100 ${
                                reminder.status === "completed"
                                  ? "text-green-500 bg-green-50"
                                  : "text-gray-400 hover:text-green-500"
                              }`}
                            >
                              <CheckIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                /* Delete reminder */
                              }}
                              className="p-1 rounded-full hover:bg-gray-100"
                            >
                              <XMarkIcon className="h-4 w-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.section>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Keep existing modal form with updated styling */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Novo Lembrete</h2>
            <form onSubmit={handleCreateReminder} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data Início
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data Fim
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Recorrência
                  </label>
                  <select
                    value={formData.recurrence}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recurrence: e.target.value as
                          | "none"
                          | "daily"
                          | "weekly"
                          | "monthly"
                          | "yearly",
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="none">Nenhuma</option>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                    <option value="yearly">Anual</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Localização
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cor
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                  className="mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="all_day"
                  checked={formData.all_day}
                  onChange={(e) =>
                    setFormData({ ...formData, all_day: e.target.checked })
                  }
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label htmlFor="all_day" className="ml-2 text-sm text-gray-700">
                  Dia Todo
                </label>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Criar Lembrete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
