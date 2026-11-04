export interface CrashCourseVariable {
  symbol: string;
  name: string;
  unit: string;
  desc: string;
}

export interface CrashCourseStep {
  stepNumber: number;
  title: string;
  explanation: string;
  math?: string;
}

export interface CrashCourseKnowledgeCheck {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface CrashCourseItem {
  id: string;
  title: string;
  tagline: string;
  category: string;
  badge: 'Basic' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  calculatorPresetValue?: any;
  calculatorPresetLabel?: string;
  mentalModelAnalogy: {
    title: string;
    analogy: string;
    icon?: string;
  };
  plainEnglish: string;
  whyItMatters: string;
  primaryEquation: string;
  equationNote?: string;
  variables: CrashCourseVariable[];
  unitConversions?: { from: string; to: string; formula: string }[];
  workedExample: {
    problemStatement: string;
    given: string[];
    steps: CrashCourseStep[];
    finalResult: string;
    verificationNote?: string;
  };
  knowledgeCheck?: CrashCourseKnowledgeCheck;
  labApplications: {
    domain: string;
    application: string;
  }[];
  commonTraps: {
    trap: string;
    howToAvoid: string;
  }[];
  proTips: string[];
  recommendedPractice: string;
}

