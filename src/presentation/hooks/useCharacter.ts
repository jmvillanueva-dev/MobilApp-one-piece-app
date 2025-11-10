import { useEffect, useState } from "react";
import { CharacterService } from "../../data/services/character.service";
import { Character } from "../../domain/entities/Character.model";

/**
 * Estado del hook para manejar personajes
 */
interface UseCharacterState {
  characters: Character[];
  loading: boolean;
  error: string | null;
}

/**
 * Hook personalizado para manejar operaciones con personajes
 */
export const useCharacter = () => {
  const [state, setState] = useState<UseCharacterState>({
    characters: [],
    loading: false,
    error: null,
  });

  /**
   * Carga todos los personajes
   */
  const fetchAllCharacters = async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const characters = await CharacterService.getAllCharacters();
      setState((prev) => ({
        ...prev,
        characters,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  };

  /**
   * Busca un personaje por ID
   */
  const fetchCharacterById = async (id: number): Promise<Character | null> => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const character = await CharacterService.getCharacterById(id);
      setState((prev) => ({ ...prev, loading: false }));
      return character;
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
      return null;
    }
  };

  /**
   * Busca personajes por nombre
   */
  const searchCharacters = async (name: string) => {
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const characters = await CharacterService.searchCharactersByName(name);
      setState((prev) => ({
        ...prev,
        characters,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : "Error desconocido",
      }));
    }
  };

  /**
   * Limpia el estado de error
   */
  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  /**
   * Refresca la lista de personajes
   */
  const refreshCharacters = () => {
    fetchAllCharacters();
  };

  // Carga automática al montar el componente
  useEffect(() => {
    fetchAllCharacters();
  }, []);

  return {
    characters: state.characters,
    loading: state.loading,
    error: state.error,
    fetchAllCharacters,
    fetchCharacterById,
    searchCharacters,
    clearError,
    refreshCharacters,
  };
};
