// Validate date based on schedule type
export const dayToName = (scheduleType) => {
  switch (scheduleType) {
    case "SIX_DAYS":
      return "শনিবার থেকে বৃহস্পতিবার";

    case "THREE_DAYS_A":
      return "শনিবার, সোমবার, বুধবার";

    case "THREE_DAYS_B":
      return "রবিবার, মঙ্গলবার, বৃহস্পতিবার";

    default:
      return null;
  }
};
