export interface BulletPointFix {
  original: string;
  improved: string;
  reason: string;
}

export interface SkillSuggestion {
  skill: string;
  category: 'technical' | 'soft';
  reason: string;
}

export interface ATSOptimization {
  issue: string;
  solution: string;
  priority: 'high' | 'medium' | 'low';
}

export interface AnalysisData {
  bullet_point_fixes: BulletPointFix[];
  skill_suggestions: SkillSuggestion[];
  ats_optimization: ATSOptimization[];
  overall_score: number;
  summary: string;
  extracted_text?: string;
}

export interface Job {
  id: number;
  title: string;
  company: string;
  location?: string;
  description: string;
  requirements?: string[];
  skills: string[];
}

export interface JobMatch {
  job: Job;
  similarity_score: number;
  rank: number;
  explanation: string;
}