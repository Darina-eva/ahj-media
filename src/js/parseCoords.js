const NUMBER = "([-+]?\\d+(?:\\.\\d+)?)";
const PAIR = `\\s*${NUMBER}\\s*,\\s*${NUMBER}\\s*`;
const PATTERN = new RegExp(`^(?:${PAIR}|\\[${PAIR}\\])$`);

export default function parseCoords(input) {
  const value = String(input)
    .trim()
    .replace(/[−‒–—]/g, "-");
  const match = value.match(PATTERN);
  if (!match) {
    throw new Error("Неверный формат координат");
  }
  const [latitude, longitude] = match
    .slice(1)
    .filter((part) => part !== undefined)
    .map(Number);
  if (Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
    throw new Error("Координаты вне допустимого диапазона");
  }
  return { latitude, longitude };
}
