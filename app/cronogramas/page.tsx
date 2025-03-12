"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  CalendarIcon,
  BookOpenIcon,
  BriefcaseIcon,
  UserIcon,
  PlusIcon,
  XMarkIcon,
  CheckIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

interface Schedule {
  id: number;
  title: string;
  description: string;
  type: "study" | "work" | "project" | "personal";
  is_active: boolean;
  blocks: ScheduleBlock[];
  goals: ScheduleGoal[];
}

interface ScheduleBlock {
  id: number;
  title: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
}

interface ScheduleGoal {
  id: number;
  title: string;
  period: "daily" | "weekly" | "monthly";
  target_minutes: number;
  current_minutes?: number;
}

interface ScheduleStats {
  active: number;
  total: number;
  totalMinutes: number;
}

export default function SchedulesPage() {
  const router = useRouter();
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [stats, setStats] = useState<ScheduleStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    type: Schedule["type"];
    blocks: ScheduleBlock[];
    goals: ScheduleGoal[];
  }>({
    title: "",
    description: "",
    type: "study",
    blocks: [],
    goals: [],
  });

  const fetchSchedules = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/auth/login");
      return;
    }

    try {
      const response = await fetch(
        "https://taskmaster.hsyst.xyz/api/schedules",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      setSchedules(data.data);
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar cronogramas");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchStats = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://taskmaster.hsyst.xyz/api/schedules/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error("Erro:", error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleUpdateSchedule = async (
    scheduleId: number,
    data: Partial<Schedule>
  ) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/schedules/${scheduleId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) throw new Error("Failed to update schedule");

      toast.success("Cronograma atualizado com sucesso!");
      fetchSchedules();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao atualizar cronograma");
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!confirm("Tem certeza que deseja excluir este cronograma?")) return;

    try {
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/schedules/${scheduleId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete schedule");

      toast.success("Cronograma excluído com sucesso!");
      fetchSchedules();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao excluir cronograma");
    }
  };

  const fetchScheduleDetails = async (scheduleId: number) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/schedules/${scheduleId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch schedule details");

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao carregar detalhes do cronograma");
    }
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const response = await fetch(
        "https://taskmaster.hsyst.xyz/api/schedules",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error("Failed to create schedule");

      toast.success("Cronograma criado com sucesso!");
      setIsFormOpen(false);
      setFormData({
        title: "",
        description: "",
        type: "study",
        blocks: [],
        goals: [],
      });
      fetchSchedules();
    } catch (error) {
      console.error("Erro:", error);
      toast.error("Erro ao criar cronograma");
    }
  };

  const getTypeIcon = (type: Schedule["type"]) => {
    switch (type) {
      case "study":
        return <BookOpenIcon className="h-5 w-5" />;
      case "work":
        return <BriefcaseIcon className="h-5 w-5" />;
      case "project":
        return <CalendarIcon className="h-5 w-5" />;
      case "personal":
        return <UserIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                Cronogramas
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Gerencie seus horários e metas
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg"
            >
              <PlusIcon className="h-5 w-5" />
              Novo Cronograma
            </motion.button>
          </div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Cronogramas Ativos</div>
                <div className="mt-1 text-2xl font-semibold">
                  {stats.active}
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">
                  Total de Cronogramas
                </div>
                <div className="mt-1 text-2xl font-semibold">{stats.total}</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-500">Tempo Total</div>
                <div className="mt-1 text-2xl font-semibold">
                  {Math.round(stats.totalMinutes / 60)}h
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {schedules.map((schedule) => (
                <motion.div
                  key={schedule.id}
                  layout
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          {getTypeIcon(schedule.type)}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">
                            {schedule.title}
                          </h3>
                          {schedule.description && (
                            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                              {schedule.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() =>
                            handleUpdateSchedule(schedule.id, {
                              is_active: !schedule.is_active,
                            })
                          }
                          className={`p-1 rounded-full hover:bg-gray-100 ${
                            schedule.is_active
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          <CheckIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={async () => {
                            const details = await fetchScheduleDetails(
                              schedule.id
                            );
                            if (details) {
                              setFormData({
                                ...details,
                                type: details.type as Schedule["type"],
                              });
                              setIsFormOpen(true);
                            }
                          }}
                          className="p-1 hover:bg-gray-50 rounded-full"
                        >
                          <PencilIcon className="h-4 w-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleDeleteSchedule(schedule.id)}
                          className="p-1 hover:bg-gray-50 rounded-full"
                        >
                          <TrashIcon className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                    </div>

                    {/* Time Blocks */}
                    {schedule.blocks.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Blocos de Hoje
                        </h4>
                        <div className="space-y-2">
                          {schedule.blocks
                            .filter((block) =>
                              block.days_of_week.includes(new Date().getDay())
                            )
                            .sort((a, b) =>
                              a.start_time.localeCompare(b.start_time)
                            )
                            .map((block) => (
                              <div
                                key={block.id}
                                className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
                              >
                                <div className="flex-shrink-0 w-16 text-xs text-gray-500">
                                  {block.start_time.slice(0, 5)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {block.title}
                                  </p>
                                </div>
                                <div className="text-xs text-gray-500">
                                  {block.end_time.slice(0, 5)}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Goals Progress */}
                    {schedule.goals.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                          Metas
                        </h4>
                        <div className="space-y-2">
                          {schedule.goals.map((goal) => (
                            <div key={goal.id} className="group relative">
                              <div className="flex items-center gap-2">
                                <div className="flex-1">
                                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-black transition-all"
                                      style={{
                                        width: `${Math.min(
                                          ((goal.current_minutes || 0) /
                                            goal.target_minutes) *
                                            100,
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                                <span className="text-xs text-gray-500">
                                  {goal.period === "daily"
                                    ? "Hoje"
                                    : goal.period === "weekly"
                                    ? "Semana"
                                    : "Mês"}
                                </span>
                              </div>
                              <div className="absolute -top-6 left-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-xs text-gray-500">
                                  {goal.title} ({goal.current_minutes || 0}/
                                  {goal.target_minutes}min)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Footer Stats */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-4 text-center text-xs">
                        <div>
                          <div className="text-gray-500">Blocos</div>
                          <div className="mt-1 font-medium">
                            {schedule.blocks.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Metas</div>
                          <div className="mt-1 font-medium">
                            {schedule.goals.length}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500">Total</div>
                          <div className="mt-1 font-medium">
                            {Math.round(
                              schedule.blocks.reduce((acc, block) => {
                                const [startHour, startMin] =
                                  block.start_time.split(":");
                                const [endHour, endMin] =
                                  block.end_time.split(":");
                                const minutes =
                                  parseInt(endHour) * 60 +
                                  parseInt(endMin) -
                                  (parseInt(startHour) * 60 +
                                    parseInt(startMin));
                                return (
                                  acc + minutes * block.days_of_week.length
                                );
                              }, 0) / 60
                            )}
                            h
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal Form */}
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
              <h2 className="text-lg font-medium text-gray-900 mb-4">
                Novo Cronograma
              </h2>
              <form onSubmit={handleCreateSchedule} className="space-y-4">
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
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
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
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
                          setFormData({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tipo
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            type: e.target.value as Schedule["type"],
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                      >
                        <option value="study">Estudo</option>
                        <option value="work">Trabalho</option>
                        <option value="project">Projeto</option>
                        <option value="personal">Pessoal</option>
                      </select>
                    </div>
                  </div>

                  {/* Blocks */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">
                        Blocos de Horário
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            blocks: [
                              ...formData.blocks,
                              {
                                id: Date.now(),
                                title: "",
                                start_time: "",
                                end_time: "",
                                days_of_week: [],
                              },
                            ],
                          })
                        }
                        className="text-sm text-black hover:text-gray-700"
                      >
                        Adicionar Bloco
                      </button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {formData.blocks.map((block, index) => (
                        <div
                          key={block.id}
                          className="p-4 bg-gray-50 rounded-lg space-y-3"
                        >
                          <div className="flex justify-between">
                            <input
                              type="text"
                              value={block.title}
                              onChange={(e) => {
                                const newBlocks = [...formData.blocks];
                                newBlocks[index].title = e.target.value;
                                setFormData({ ...formData, blocks: newBlocks });
                              }}
                              placeholder="Título do bloco"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newBlocks = formData.blocks.filter(
                                  (_, i) => i !== index
                                );
                                setFormData({ ...formData, blocks: newBlocks });
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Início
                              </label>
                              <input
                                type="time"
                                value={block.start_time}
                                onChange={(e) => {
                                  const newBlocks = [...formData.blocks];
                                  newBlocks[index].start_time = e.target.value;
                                  setFormData({
                                    ...formData,
                                    blocks: newBlocks,
                                  });
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Fim
                              </label>
                              <input
                                type="time"
                                value={block.end_time}
                                onChange={(e) => {
                                  const newBlocks = [...formData.blocks];
                                  newBlocks[index].end_time = e.target.value;
                                  setFormData({
                                    ...formData,
                                    blocks: newBlocks,
                                  });
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700">
                              Dias da Semana
                            </label>
                            <div className="mt-1 flex flex-wrap gap-2">
                              {[
                                "Dom",
                                "Seg",
                                "Ter",
                                "Qua",
                                "Qui",
                                "Sex",
                                "Sáb",
                              ].map((day, i) => (
                                <button
                                  key={i}
                                  type="button"
                                  onClick={() => {
                                    const newBlocks = [...formData.blocks];
                                    const days = newBlocks[index].days_of_week;
                                    if (days.includes(i)) {
                                      days.splice(days.indexOf(i), 1);
                                    } else {
                                      days.push(i);
                                    }
                                    days.sort();
                                    setFormData({
                                      ...formData,
                                      blocks: newBlocks,
                                    });
                                  }}
                                  className={`px-2 py-1 text-sm rounded-md ${
                                    block.days_of_week.includes(i)
                                      ? "bg-black text-white"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }`}
                                >
                                  {day}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Goals */}
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-medium text-gray-700">
                        Metas
                      </h3>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({
                            ...formData,
                            goals: [
                              ...formData.goals,
                              {
                                id: Date.now(),
                                title: "",
                                period: "daily",
                                target_minutes: 0,
                              },
                            ],
                          })
                        }
                        className="text-sm text-black hover:text-gray-700"
                      >
                        Adicionar Meta
                      </button>
                    </div>
                    <div className="mt-2 space-y-3">
                      {formData.goals.map((goal, index) => (
                        <div
                          key={goal.id}
                          className="p-4 bg-gray-50 rounded-lg space-y-3"
                        >
                          <div className="flex justify-between">
                            <input
                              type="text"
                              value={goal.title}
                              onChange={(e) => {
                                const newGoals = [...formData.goals];
                                newGoals[index].title = e.target.value;
                                setFormData({ ...formData, goals: newGoals });
                              }}
                              placeholder="Título da meta"
                              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const newGoals = formData.goals.filter(
                                  (_, i) => i !== index
                                );
                                setFormData({ ...formData, goals: newGoals });
                              }}
                              className="ml-2 text-gray-400 hover:text-red-500"
                            >
                              <XMarkIcon className="h-5 w-5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Período
                              </label>
                              <select
                                value={goal.period}
                                onChange={(e) => {
                                  const newGoals = [...formData.goals];
                                  newGoals[index].period = e.target
                                    .value as ScheduleGoal["period"];
                                  setFormData({ ...formData, goals: newGoals });
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                              >
                                <option value="daily">Diário</option>
                                <option value="weekly">Semanal</option>
                                <option value="monthly">Mensal</option>
                              </select>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700">
                                Minutos
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={goal.target_minutes}
                                onChange={(e) => {
                                  const newGoals = [...formData.goals];
                                  newGoals[index].target_minutes = parseInt(
                                    e.target.value
                                  );
                                  setFormData({ ...formData, goals: newGoals });
                                }}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-gray-900"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
