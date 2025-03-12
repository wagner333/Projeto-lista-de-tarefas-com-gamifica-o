export interface ScheduleBlock {
  id: number;
  schedule_id: number;
  title: string;
  start_time: string;
  end_time: string;
  days_of_week: number[];
  duration?: number;
  is_currently_active?: boolean;
  today_completion?: number;
}

export interface ScheduleGoal {
  id: number;
  schedule_id: number;
  title: string;
  period: "daily" | "weekly" | "monthly";
  target_minutes: number;
}

export interface Schedule {
  id?: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  priority: "low" | "medium" | "high";
  status: "pending" | "in_progress" | "completed";
  type: "study" | "work" | "project" | "personal";
  recurrence?: "daily" | "weekly" | "monthly";
  recurrence_config?: {
    days: string[];
    times: number;
  };
  all_day: boolean;
  notifications: Array<{
    type: "email" | "push" | "sms";
    time: number;
    unit: "minutes" | "hours" | "days";
  }>;
  location?: string;
  attachments: Array<{
    name: string;
    url: string;
  }>;
  color: string;
}

export interface ScheduleStats {
  today: {
    completed_blocks: number;
    total_minutes: number;
    active_schedules: number;
  };
  weekly: {
    completed_blocks: number;
    average_minutes_per_day: number;
  };
  achievements: string[];
}
