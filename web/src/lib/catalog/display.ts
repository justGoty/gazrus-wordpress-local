export function formatBrandId(brandId: string) {
  return brandId
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toLocaleUpperCase("ru") + part.slice(1))
    .join(" ");
}
