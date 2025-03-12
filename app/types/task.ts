export interface Task {
  id: number;
  title: string;
  description: string;
  difficulty: number;
  deadline: string | null;
  status: "pending" | "in_progress" | "completed" | "failed";
  gold_reward: number;
  exp_reward: number;
  is_daily: boolean;
}
