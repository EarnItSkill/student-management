// src/utils/scheduleHelper.js

/**
 * Get all class unlock dates based on batch schedule
 * @param {string} startDate - Batch start date (YYYY-MM-DD)
 * @param {string} scheduleType - SIX_DAYS, THREE_DAYS_A, THREE_DAYS_B
 * @param {number} totalClasses - Total number of classes in course
 * @returns {Array<string>} - Array of unlock dates (YYYY-MM-DD)
 */
export const getClassUnlockDates = (startDate, scheduleType, totalClasses) => {
  const unlockDates = [];
  const start = new Date(startDate);
  let currentDate = new Date(start);

  // Define which days classes occur based on schedule type
  const scheduleDays = {
    SIX_DAYS: [6, 0, 1, 2, 3, 4], // Sat-Thu (0=Sun, 6=Sat)
    THREE_DAYS_A: [6, 1, 3], // Sat, Mon, Wed
    THREE_DAYS_B: [0, 2, 4], // Sun, Tue, Thu
  };

  const allowedDays = scheduleDays[scheduleType] || [];

  while (unlockDates.length < totalClasses) {
    const dayOfWeek = currentDate.getDay();

    // Check if this day is a class day
    if (allowedDays.includes(dayOfWeek)) {
      unlockDates.push(currentDate.toISOString().split("T")[0]);
    }

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);

    // Safety limit to prevent infinite loop (max 1 year)
    if (currentDate - start > 365 * 24 * 60 * 60 * 1000) {
      break;
    }
  }

  return unlockDates;
};

/**
 * Check if a class is unlocked for a student
 * @param {number} classIndex - Class index (0-based)
 * @param {Array<string>} unlockDates - Array of unlock dates
 * @param {string} currentDate - Current date (YYYY-MM-DD)
 * @returns {boolean}
 */
export const isClassUnlocked = (
  classIndex,
  unlockDates,
  currentDate = null
) => {
  if (!unlockDates || !unlockDates[classIndex]) return false;

  const today = currentDate || new Date().toISOString().split("T")[0];
  const unlockDate = unlockDates[classIndex];

  return today >= unlockDate;
};

/**
 * Check if a quiz is unlocked for a student
 * @param {number} quizIndex - Quiz index in course
 * @param {Array<string>} unlockDates - Array of unlock dates
 * @param {Array<object>} quizResults - Student's quiz results
 * @param {string} currentDate - Current date (YYYY-MM-DD)
 * @returns {boolean}
 */
export const isQuizUnlocked = (
  quizIndex,
  unlockDates,
  quizResults,
  currentDate = null
) => {
  // First check if class is unlocked
  if (!isClassUnlocked(quizIndex, unlockDates, currentDate)) {
    return false;
  }

  // If this is the first quiz, it's unlocked after class
  if (quizIndex === 0) {
    return true;
  }

  // Check if previous quiz is completed
  const previousQuizCompleted = quizResults && quizResults[quizIndex - 1];

  return previousQuizCompleted;
};

/**
 * Get unlock date for a specific class
 * @param {number} classIndex - Class index (0-based)
 * @param {Array<string>} unlockDates - Array of unlock dates
 * @returns {string|null} - Unlock date or null
 */
export const getClassUnlockDate = (classIndex, unlockDates) => {
  return unlockDates && unlockDates[classIndex]
    ? unlockDates[classIndex]
    : null;
};
