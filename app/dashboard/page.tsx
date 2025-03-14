"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ClockIcon,
  CalendarIcon,
  BellIcon,
  Bars3Icon,
  FireIcon,
  CheckCircleIcon,
  XMarkIcon,
  UserIcon,
  CurrencyDollarIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

// Add interfaces for components
interface StatCardProps {
  title: string;
  value: number;
  total?: number;
  icon: React.ReactNode;
  unit?: string;
  best?: number;
}

interface Activity {
  id: number;
  title: string;
  status: "completed" | "pending";
  updated_at: string;
}

interface UserStats {
  user: {
    name: string;
    email: string;
    gold: number;
    level: number;
    exp: number;
    tasks_completed: number;
    daily_streak: number;
    total_study_time: number;
    total_tasks_created: number;
    total_tasks_completed: number;
    language: string;
    last_login_at: string | null;
    created_at: string;
  };
  tasks: {
    completed: number;
    total: number;
    recent: Array<{
      id: number;
      title: string;
      status: "completed" | "pending";
      updated_at: string;
    }>;
  };
  schedules: {
    active: number;
    total: number;
    totalMinutes: number;
  };
  reminders: {
    pending: number;
    total: number;
  };
  streak: {
    current: number;
    best: number;
    lastActive: string;
  };
}

export default function Dashboard() {
  const router = useRouter();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getMenuItems = () => [
    {
      title: "Tarefas",
      icon: <ClockIcon className="h-5 w-5" />,
      href: "/tarefas",
      count: userStats?.tasks.total || 0,
      progress: userStats
        ? (userStats.tasks.completed / userStats.tasks.total) * 100
        : 0,
    },
    {
      title: "Cronogramas",
      icon: <CalendarIcon className="h-5 w-5" />,
      href: "/cronogramas",
      count: userStats?.schedules.active || 0,
      minutes: userStats?.schedules.totalMinutes || 0,
    },
    {
      title: "pomodoro",
      icon: <ClockIcon className="h-5 w-5" />,
      href: "/pomodoro",
      count: userStats?.schedules.active || 0,
      minutes: userStats?.schedules.totalMinutes || 0,
    },
  ];

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login");
        return;
      }

      const response = await fetch("https://taskmaster.hsyst.xyz/api/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();

        setUserStats({
          user: {
            name: userData.name || "",
            email: userData.email || "",
            gold: userData.gold || 0,
            level: userData.level || 1,
            exp: userData.exp || 0,
            tasks_completed: userData.tasks_completed || 0,
            daily_streak: userData.daily_streak || 0,
            total_study_time: userData.total_study_time || 0,
            total_tasks_created: userData.total_tasks_created || 0,
            total_tasks_completed: userData.total_tasks_completed || 0,
            language: userData.language || "pt_BR",
            last_login_at: userData.last_login_at || null,
            created_at: userData.created_at || new Date().toISOString(),
          },
          tasks: {
            completed: userData.tasks_completed || 0,
            total: userData.total_tasks_created || 0,
            recent: [],
          },
          schedules: {
            active: 0,
            total: 0,
            totalMinutes: 0,
          },
          reminders: {
            pending: 0,
            total: 0,
          },
          streak: {
            current: userData.daily_streak || 0,
            best: userData.daily_streak || 0,
            lastActive: userData.last_active_at || new Date().toISOString(),
          },
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchUserData();
    // Add real-time updates every minute
    const interval = setInterval(fetchUserData, 60000);
    return () => clearInterval(interval);
  }, [fetchUserData]);

  // Add this type guard function at the top of your component
  const isValidUser = (user: unknown): user is UserStats["user"] => {
    return Boolean(
      user && typeof user === "object" && user !== null && "name" in user
    );
  };

  // Sidebar content component
  const SidebarContent = ({ onClose }: { onClose?: () => void }) => (
    <div className="p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className={`font-semibold text-xl ${!isSidebarOpen && "hidden"}`}>
          Workspace
        </h1>
        {onClose ? (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Bars3Icon className="h-5 w-5 text-gray-500" />
          </button>
        )}
      </div>

      <nav className="space-y-1">
        {getMenuItems().map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center p-3 text-gray-600 rounded-lg hover:bg-gray-100 group transition-colors"
          >
            <span className="p-2">{item.icon}</span>
            {(isSidebarOpen || onClose) && (
              <div className="flex justify-between items-center flex-1">
                <span>{item.title}</span>
                {(item.count !== undefined || item.minutes !== undefined) && (
                  <div className="flex items-center gap-2">
                    {item.minutes !== undefined && (
                      <span className="text-sm text-gray-400">
                        {Math.round(item.minutes / 60)}h
                      </span>
                    )}
                    {item.count !== undefined && (
                      <span className="text-sm font-medium text-gray-400">
                        {item.count}
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );

  // Stats Card component
  const StatCard = ({
    title,
    value,
    total,
    icon,
    unit,
    best,
  }: StatCardProps) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition-all duration-200 hover:shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="text-gray-500 text-sm">{title}</span>
        {icon}
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-semibold">{value}</p>
          {total && <p className="text-sm text-gray-500">de {total} total</p>}
          {unit && <p className="text-sm text-gray-500">{unit}</p>}
          {best && <p className="text-sm text-gray-500">Melhor: {best}</p>}
        </div>
        {total && (
          <div className="h-1 w-20 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${(value / total) * 100}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );

  // Recent Activity component
  const RecentActivity = ({ activities }: { activities: Activity[] }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4">Atividade Recente</h2>
      <div className="space-y-4">
        {activities?.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              {activity.status === "completed" ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <ClockIcon className="h-5 w-5 text-orange-500" />
              )}
              <span>{activity.title}</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(activity.updated_at).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  // User Profile component
  const UserProfile = ({ user }: { user: UserStats["user"] }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
      <div className="flex flex-col space-y-6">
        {/* User Basic Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-indigo-100 p-3 rounded-full">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-xs text-gray-500">Gold</p>
                <p className="text-lg font-semibold text-yellow-600">
                  {user.gold}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <SparklesIcon className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-xs text-gray-500">Level</p>
                <p className="text-lg font-semibold text-blue-600">
                  {user.level}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Experience</span>
            <span>{user.exp} XP</span>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(user.exp / 1000) * 100}%` }}
            />
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <p className="text-sm text-gray-500">Daily Streak</p>
            <p className="text-lg font-semibold text-orange-500">
              {user.daily_streak}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Study Time</p>
            <p className="text-lg font-semibold text-purple-500">
              {Math.round(user.total_study_time / 60)}h
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Tasks Created</p>
            <p className="text-lg font-semibold text-green-500">
              {user.total_tasks_created}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-500">Tasks Completed</p>
            <p className="text-lg font-semibold text-blue-500">
              {user.total_tasks_completed}
            </p>
          </div>
        </div>

        {/* User Meta Info */}
        <div className="flex justify-between text-xs text-gray-400 pt-4 border-t border-gray-100">
          <span>
            Member since: {new Date(user.created_at).toLocaleDateString()}
          </span>
          {user.last_login_at && (
            <span>
              Last login: {new Date(user.last_login_at).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Update the Dashboard component's return statement
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="fixed inset-y-0 left-0 w-64 bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent onClose={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <aside
          className={`hidden md:block bg-white border-r border-gray-200 
            ${isSidebarOpen ? "w-64" : "w-20"} transition-all duration-300`}
        >
          <SidebarContent />
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          {/* Mobile Header */}
          <header className="bg-white border-b border-gray-200 p-4 md:hidden">
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-xl">Dashboard</h1>
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Bars3Icon className="h-6 w-6 text-gray-500" />
              </button>
            </div>
          </header>

          {/* Dashboard Content */}
          <div className="p-6 max-w-7xl mx-auto">
            {/* User Profile with null check */}
            {isValidUser(userStats?.user) ? (
              <UserProfile user={userStats.user} />
            ) : (
              <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
                <div className="animate-pulse flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Tarefas Completadas"
                value={userStats?.tasks.completed || 0}
                total={userStats?.tasks.total || 0}
                icon={<CheckCircleIcon className="h-6 w-6 text-green-500" />}
              />
              <StatCard
                title="Tempo Total"
                value={Math.round(
                  (userStats?.schedules.totalMinutes || 0) / 60
                )}
                unit="horas"
                icon={<ClockIcon className="h-6 w-6 text-blue-500" />}
              />
              <StatCard
                title="Streak Atual"
                value={userStats?.streak.current || 0}
                best={userStats?.streak.best || 0}
                icon={<FireIcon className="h-6 w-6 text-orange-500" />}
              />
              <StatCard
                title="Lembretes Pendentes"
                value={userStats?.reminders.pending || 0}
                total={userStats?.reminders.total || 0}
                icon={<BellIcon className="h-6 w-6 text-purple-500" />}
              />
            </div>

            {/* Recent Activity with null check */}
            {userStats?.tasks?.recent && (
              <RecentActivity activities={userStats.tasks.recent} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
