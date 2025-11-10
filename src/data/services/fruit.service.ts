import { Fruit, FruitsApiResponse } from "../../domain/entities/Fruit.model";
import { apiClient } from "./api.config";

/**
 * Función helper para verificar si un texto incluye el término de búsqueda de manera segura
 */
const safeIncludes = (
  text: string | null | undefined,
  searchTerm: string
): boolean => {
  return text ? text.toLowerCase().includes(searchTerm) : false;
};

/**
 * Función para sanitizar datos de fruta que vienen de la API
 */
const sanitizeFruit = (fruit: any): Fruit => {
  return {
    id: fruit.id || 0,
    name: fruit.name || "Fruta Desconocida",
    description: fruit.description || "Descripción no disponible",
    roman_name: fruit.roman_name || "",
    type: fruit.type || "Paramecia",
    filename: fruit.filename || "",
    technicalFile: fruit.technicalFile || "",
  };
};

/**
 * Servicio para operaciones relacionadas con las frutas del diablo
 */
export class FruitService {
  /**
   * Obtiene todas las frutas del diablo disponibles
   * @returns Promise<Fruit[]> Lista de todas las frutas del diablo
   */
  static async getAllFruits(): Promise<Fruit[]> {
    try {
      const response = await apiClient.get<FruitsApiResponse>("/fruits/en");
      // Sanitizar los datos para prevenir errores de propiedades undefined/null
      return response.data.map((fruit) => sanitizeFruit(fruit));
    } catch (error) {
      console.error("Error al obtener frutas del diablo:", error);
      throw new Error(
        "No se pudieron cargar las frutas del diablo. Verifica tu conexión a internet."
      );
    }
  }

  /**
   * Obtiene una fruta del diablo específica por ID
   * @param id - ID de la fruta del diablo
   * @returns Promise<Fruit> Datos de la fruta del diablo
   */
  static async getFruitById(id: number): Promise<Fruit> {
    try {
      const fruits = await this.getAllFruits();
      const fruit = fruits.find((f) => f.id === id);

      if (!fruit) {
        throw new Error(`Fruta del diablo con ID ${id} no encontrada`);
      }

      return fruit;
    } catch (error) {
      console.error("Error al obtener fruta del diablo:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("No se pudo cargar la fruta del diablo.");
    }
  }

  /**
   * Filtra frutas del diablo por tipo
   * @param type - Tipo de fruta (Paramecia, Zoan, Logia)
   * @returns Promise<Fruit[]> Lista de frutas filtradas por tipo
   */
  static async getFruitsByType(
    type: "Paramecia" | "Zoan" | "Logia"
  ): Promise<Fruit[]> {
    try {
      const fruits = await this.getAllFruits();
      return fruits.filter((fruit) => fruit.type === type);
    } catch (error) {
      console.error("Error al filtrar frutas por tipo:", error);
      throw new Error("No se pudieron cargar las frutas del diablo.");
    }
  }

  /**
   * Busca frutas del diablo por nombre
   * @param searchTerm - Término de búsqueda
   * @returns Promise<Fruit[]> Lista de frutas que coinciden con la búsqueda
   */
  static async searchFruits(searchTerm: string): Promise<Fruit[]> {
    try {
      const fruits = await this.getAllFruits();
      const lowercaseSearch = searchTerm.toLowerCase();

      return fruits.filter(
        (fruit) =>
          safeIncludes(fruit.name, lowercaseSearch) ||
          safeIncludes(fruit.roman_name, lowercaseSearch) ||
          safeIncludes(fruit.description, lowercaseSearch) ||
          safeIncludes(fruit.type, lowercaseSearch)
      );
    } catch (error) {
      console.error("Error al buscar frutas:", error);
      throw new Error("No se pudo realizar la búsqueda.");
    }
  }
}
