export type ToolCategory =
  | 'All'
  | 'Calculations'
  | 'Equations'
  | 'Solutions'
  | 'Thermodynamics'
  | 'Gas Laws'
  | 'Reference';

export type ToolDifficulty = 'Basic' | 'Intermediate' | 'Advanced';

export interface ToolItem {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  category: ToolCategory;
  badge: ToolDifficulty;
  iconPath: string;
}

