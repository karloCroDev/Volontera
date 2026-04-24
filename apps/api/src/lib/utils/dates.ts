export function parseDurationDays(
  value: unknown,
) {
  const firstValue = Array.isArray(value) ? value[0] : value;
  const normalizedValue =
    typeof firstValue === "string" ? Number(firstValue) : firstValue;

  if (
    typeof normalizedValue !== "number" ||
    !Number.isFinite(normalizedValue) ||
    normalizedValue <= 0
  ) {
    return 30;
  }

  return Math.trunc(normalizedValue);
}
