export const toSlug = (str: string): string =>
  str
    .toLowerCase()
    .replaceAll(/\s+/g, "-") // Reemplaza los espacios por guiones
    .replaceAll(/[^\w-]+/g, ""); // Elimina caracteres no alfanuméricos excepto guiones

export const addPrefix =
  (prefix: string) =>
  (str: string): string =>
    `${prefix}${str}`;

export const addSuffix =
  (suffix: string) =>
  (str: string): string =>
    `${str}${suffix}`;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const toTitleCase = (str: string): string =>
  str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

export const truncate =
  (maxLength: number) =>
  (str: string): string =>
    str.length > maxLength ? str.slice(0, maxLength) + "..." : str;
