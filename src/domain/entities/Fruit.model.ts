/**
 * Modelo que representa una fruta del diablo en One Piece
 */
export interface Fruit {
  /** ID único de la fruta */
  id: number;

  /** Nombre de la fruta en inglés */
  name: string;

  /** Descripción detallada de la fruta y sus poderes */
  description: string;

  /** Nombre romanizado en japonés */
  roman_name: string;

  /** Tipo de fruta del diablo (Paramecia, Zoan, Logia) */
  type: "Paramecia" | "Zoan" | "Logia";

  /** URL de la imagen de la fruta */
  filename: string;

  /** URL base para archivos técnicos */
  technicalFile: string;
}

/**
 * Tipos de frutas del diablo disponibles
 */
export enum FruitType {
  PARAMECIA = "Paramecia",
  ZOAN = "Zoan",
  LOGIA = "Logia",
}

/**
 * Respuesta de la API para obtener frutas del diablo
 */
export type FruitsApiResponse = Fruit[];
