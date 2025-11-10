import {
  Character,
  CharactersResponse,
} from "../../domain/entities/Character.model";
import { apiClient } from "./api.config";

/**
 * Servicio para manejar operaciones relacionadas con personajes de One Piece
 */
export class CharacterService {
  /**
   * Obtiene todos los personajes de One Piece
   * @returns Promise con la lista de personajes
   */
  static async getAllCharacters(): Promise<Character[]> {
    try {
      const response = await apiClient.get<CharactersResponse>(
        "/characters/en"
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching characters:", error);
      throw new Error("No se pudieron cargar los personajes");
    }
  }

  /**
   * Obtiene un personaje específico por ID
   * @param id ID del personaje
   * @returns Promise con el personaje
   */
  static async getCharacterById(id: number): Promise<Character> {
    try {
      const response = await apiClient.get<Character>(`/characters/en/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching character with id ${id}:`, error);
      throw new Error(`No se pudo cargar el personaje con ID ${id}`);
    }
  }

  /**
   * Busca personajes por nombre
   * @param name Nombre del personaje a buscar
   * @returns Promise con la lista de personajes que coinciden
   */
  static async searchCharactersByName(name: string): Promise<Character[]> {
    try {
      // Nota: Este endpoint puede variar según la documentación de la API
      const response = await apiClient.get<CharactersResponse>(
        `/characters/en/search/${name}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error searching characters with name ${name}:`, error);
      throw new Error(`No se pudieron buscar personajes con el nombre ${name}`);
    }
  }
}
