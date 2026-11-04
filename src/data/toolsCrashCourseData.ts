import { Language } from '../i18n/types';
import { CrashCourseItem, CrashCourseVariable, CrashCourseStep, CrashCourseKnowledgeCheck } from './crashCourse/types';
import { CRASH_COURSES_EN } from './crashCourse/en';
import { CRASH_COURSES_FR } from './crashCourse/fr';
import { CRASH_COURSES_AR } from './crashCourse/ar';

export type { CrashCourseItem, CrashCourseVariable, CrashCourseStep, CrashCourseKnowledgeCheck };
export { CRASH_COURSES_EN, CRASH_COURSES_FR, CRASH_COURSES_AR };

/**
 * Returns the localized CrashCourse item for a given tool and language.
 * Falls back to English if a localized entry is missing.
 */
export const getCrashCourse = (toolId: string, lang: Language = 'en'): CrashCourseItem | undefined => {
  if (lang === 'ar') {
    return CRASH_COURSES_AR[toolId] || CRASH_COURSES_EN[toolId];
  }
  if (lang === 'fr') {
    return CRASH_COURSES_FR[toolId] || CRASH_COURSES_EN[toolId];
  }
  return CRASH_COURSES_EN[toolId];
};

/**
 * Backward compatibility: default English dictionary
 */
export const TOOLS_CRASH_COURSES: Record<string, CrashCourseItem> = CRASH_COURSES_EN;
