const PLATES = [20, 15, 10, 5, 2.5, 1.25];
const BARBELL = 20;

export function formatPlates(totalKg) {
  const perSide = (totalKg - BARBELL) / 2;
  if (perSide <= 0) return null;
  let rem = Math.round(perSide * 100) / 100;
  const used = [];
  for (const p of PLATES) {
    const n = Math.floor(rem / p + 0.001);
    if (n > 0) {
      used.push(n > 1 ? `${n}×${p}` : `${p}kg`);
      rem = Math.round((rem - n * p) * 100) / 100;
    }
  }
  if (!used.length) return null;
  return `${BARBELL}kg stang · [${used.join(' + ')}] / zijde`;
}
