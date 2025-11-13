export function numberToBangla(num) {
  if (num === null || num === undefined) return "";

  const engToBanDigits = {
    0: "০",
    1: "১",
    2: "২",
    3: "৩",
    4: "৪",
    5: "৫",
    6: "৬",
    7: "৭",
    8: "৮",
    9: "৯",
    ".": ".",
  };

  return String(num)
    .split("")
    .map((digit) => engToBanDigits[digit] ?? digit)
    .join("");
}
