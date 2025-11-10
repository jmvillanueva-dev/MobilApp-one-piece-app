/**
 * Modelo de Crew (Tripulación)
 */
export interface Crew {
  id: number;
  name: string;
  description: string;
  status: string;
  number: string;
  roman_name: string;
  total_prime: string;
  is_yonko: string;
}

/**
 * Modelo de Fruit (Fruta del Diablo)
 */
export interface Fruit {
  id: number;
  name: string;
  description: string;
  type: string;
  filename: string;
  roman_name: string;
  technicalFile: string;
}

/**
 * Modelo principal de Character (Personaje)
 */
export interface Character {
  id: number;
  name: string;
  job: string;
  size: string;
  birthday: string;
  age: string;
  bounty: string;
  status: string;
  crew?: Crew; // Opcional porque algunos personajes pueden no tener tripulación
  fruit?: Fruit; // Opcional porque no todos tienen fruta del diablo
}

/**
 * Tipo para la respuesta de la API que contiene lista de personajes
 */
export type CharactersResponse = Character[];
