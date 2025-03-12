"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PlusIcon,
  StarIcon,
  CalendarIcon,
  CheckIcon,
  XMarkIcon,
  ArrowSmallUpIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Task } from "../types/task";

export default function TasksPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: 1,
    deadline: "",
    is_daily: false,
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("https://taskmaster.hsyst.xyz/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId: number) => {
    const loadingToast = toast.loading("Completando tarefa...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/tasks/${taskId}/complete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        toast.success(
          `Tarefa concluída! +${data.rewards.gold} gold, +${data.rewards.exp} exp`,
          {
            id: loadingToast,
          }
        );
        fetchTasks();
      } else {
        toast.error(data.message || "Erro ao completar tarefa", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Erro ao completar tarefa:", error);
      toast.error("Erro ao completar tarefa", {
        id: loadingToast,
      });
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const taskData = {
        title: formData.title,
        description: formData.description || "",
        status: "pending",
        difficulty: formData.difficulty,
        deadline: formData.deadline || null,
        is_daily: formData.is_daily,
      };

      const response = await fetch("https://taskmaster.hsyst.xyz/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success notification
        toast.success("Tarefa criada com sucesso!");
        setIsModalOpen(false);
        setFormData({
          title: "",
          description: "",
          difficulty: 1,
          deadline: "",
          is_daily: false,
        });
        fetchTasks();
      } else {
        // Error handling
        if (data.errors) {
          // Validation errors
          Object.values(data.errors).forEach((error: any) => {
            toast.error(error[0]);
          });
        } else {
          toast.error(data.message || "Erro ao criar tarefa");
        }
      }
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      toast.error("Erro ao criar tarefa. Tente novamente.");
    }
  };

  const deleteTask = async (taskId: number) => {
    const loadingToast = toast.loading("Deletando tarefa...");
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://taskmaster.hsyst.xyz/api/tasks/${taskId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Tarefa deletada com sucesso!", {
          id: loadingToast,
        });
        fetchTasks();
      } else {
        const data = await response.json();
        toast.error(data.message || "Erro ao deletar tarefa", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      toast.error("Erro ao deletar tarefa", {
        id: loadingToast,
      });
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    const colors = {
      1: "text-green-400",
      2: "text-blue-400",
      3: "text-yellow-400",
      4: "text-orange-400",
      5: "text-red-400",
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getStatusColor = (status: Task["status"]) => {
    const colors = {
      pending: "bg-yellow-500",
      in_progress: "bg-blue-500",
      completed: "bg-green-500",
      failed: "bg-red-500",
    };
    return colors[status];
  };

  // New grouping function
  const groupTasksByStatus = (tasks: Task[]) => {
    return tasks.reduce((groups, task) => {
      const status = task.status;
      if (!groups[status]) {
        groups[status] = [];
      }
      groups[status].push(task);
      return groups;
    }, {} as Record<string, Task[]>);
  };

  function getOrderedTaskGroups(tasks: Task[]) {
    const grouped = groupTasksByStatus(tasks);
    const statusOrder = ["pending", "in_progress", "completed"];

    return statusOrder
      .map((status) => ({
        status,
        tasks: grouped[status] || [],
      }))
      .filter((group) => group.tasks.length > 0);
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold text-gray-900">Tarefas</h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm hover:bg-gray-800 transition-colors"
            >
              <PlusIcon className="h-4 w-4" />
              <span>Nova Tarefa</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-black" />
          </div>
        ) : (
          <div className="space-y-8">
            {getOrderedTaskGroups(tasks).map(
              ({ status, tasks: tasksInGroup }) => (
                <div key={status} className="space-y-4">
                  <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    {status === "pending"
                      ? "Para fazer"
                      : status === "in_progress"
                      ? "Em andamento"
                      : status === "completed"
                      ? "Concluídas"
                      : "Outras"}
                    <span className="ml-2 text-gray-400">
                      ({tasksInGroup.length})
                    </span>
                  </h2>
                  <div className="space-y-2">
                    {tasksInGroup.map((task) => (
                      <div
                        key={task.id}
                        className="group flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <button
                          onClick={() => completeTask(task.id)}
                          className={`flex-shrink-0 w-5 h-5 rounded-full border-2 
                          ${
                            task.status === "completed"
                              ? "border-green-500 bg-green-500"
                              : "border-gray-300"
                          } 
                          hover:border-green-500 transition-colors`}
                        >
                          {task.status === "completed" && (
                            <CheckIcon className="h-4 w-4 text-white" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3
                                className={`text-base ${
                                  task.status === "completed"
                                    ? "text-gray-500 line-through"
                                    : "text-gray-900"
                                }`}
                              >
                                {task.title}
                              </h3>
                              {task.description && (
                                <p className="mt-1 text-sm text-gray-500">
                                  {task.description}
                                </p>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="flex items-center text-sm text-gray-500">
                                  <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                                  {task.gold_reward}
                                </div>
                                <div className="flex items-center text-sm text-gray-500">
                                  <ArrowSmallUpIcon className="h-4 w-4 text-blue-400 mr-1" />
                                  {task.exp_reward}
                                </div>
                              </div>
                              {task.status === "completed" && (
                                <button
                                  onClick={() => deleteTask(task.id)}
                                  className="p-1 rounded-full hover:bg-red-100 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <TrashIcon className="h-4 w-4 text-red-500" />
                                </button>
                              )}
                            </div>
                          </div>

                          <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                            {task.deadline && (
                              <div className="flex items-center gap-1">
                                <CalendarIcon className="h-4 w-4" />
                                {new Date(task.deadline).toLocaleDateString()}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <StarIcon className="h-4 w-4" />
                              Nível {task.difficulty}
                            </div>
                            {task.is_daily && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                                Diária
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </main>

      {/* Modal - Keep existing modal code but update styles */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Nova Tarefa
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Keep existing form but update input styles to match the minimalist theme */}
            <form onSubmit={createTask} className="space-y-4">
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
                  className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dificuldade
                </label>
                <select
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: Number(e.target.value),
                    })
                  }
                  className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                >
                  <option value={1}>Muito Fácil</option>
                  <option value={2}>Fácil</option>
                  <option value={3}>Médio</option>
                  <option value={4}>Difícil</option>
                  <option value={5}>Muito Difícil</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data Limite
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) =>
                    setFormData({ ...formData, deadline: e.target.value })
                  }
                  className="mt-1 block w-full rounded-lg border-gray-200 focus:border-gray-300 focus:ring focus:ring-gray-200 focus:ring-opacity-50"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_daily}
                  onChange={(e) =>
                    setFormData({ ...formData, is_daily: e.target.checked })
                  }
                  className="rounded bg-gray-200 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label className="ml-2 text-sm text-gray-700">
                  Tarefa Diária
                </label>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
                >
                  Criar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
