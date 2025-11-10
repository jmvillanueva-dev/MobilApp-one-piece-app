import { useCallback, useEffect, useState } from "react";
import { FruitService } from "../../data/services/fruit.service";
import { Fruit } from "../../domain/entities/Fruit.model";

/**
 * Función helper para convertir texto a lowercase de manera segura
 */
const safeToLowerCase = (text: string | null | undefined): string => {
  return text ? text.toLowerCase() : "";
};

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
 * Hook personalizado para manejar el estado y operaciones de las frutas del diablo
 */
export const useFruit = () => {
  // Estados principales
  const [fruits, setFruits] = useState<Fruit[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Estados de filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedType, setSelectedType] = useState<
    "all" | "Paramecia" | "Zoan" | "Logia"
  >("all");
  const [filteredFruits, setFilteredFruits] = useState<Fruit[]>([]);

  /**
   * Carga todas las frutas del diablo desde la API
   */
  const fetchFruits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const fruitsData = await FruitService.getAllFruits();
      setFruits(fruitsData);
      setFilteredFruits(fruitsData);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error desconocido al cargar frutas del diablo";
      setError(errorMessage);
      console.error("Error fetching fruits:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Aplica filtros de búsqueda y tipo a la lista de frutas
   */
  const applyFilters = useCallback(
    (
      fruitsToFilter: Fruit[] = fruits,
      search: string = searchTerm,
      type: typeof selectedType = selectedType
    ) => {
      let filtered = [...fruitsToFilter];

      // Filtrar por tipo si no es 'all'
      if (type !== "all") {
        filtered = filtered.filter((fruit) => fruit.type === type);
      }

      // Filtrar por término de búsqueda
      if (search.trim()) {
        const lowercaseSearch = search.toLowerCase();
        filtered = filtered.filter(
          (fruit) =>
            safeIncludes(fruit.name, lowercaseSearch) ||
            safeIncludes(fruit.roman_name, lowercaseSearch) ||
            safeIncludes(fruit.type, lowercaseSearch) ||
            safeIncludes(fruit.description, lowercaseSearch)
        );
      }

      setFilteredFruits(filtered);
    },
    [fruits, searchTerm, selectedType]
  );

  /**
   * Refresca los datos de las frutas (para pull-to-refresh)
   */
  const refreshFruits = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);

      const fruitsData = await FruitService.getAllFruits();
      setFruits(fruitsData);

      // Reaplicar filtros después del refresh
      applyFilters(fruitsData, searchTerm, selectedType);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Error al actualizar frutas del diablo";
      setError(errorMessage);
      console.error("Error refreshing fruits:", err);
    } finally {
      setRefreshing(false);
    }
  }, [searchTerm, selectedType, applyFilters]);

  /**
   * Busca frutas por término
   */
  const searchFruits = useCallback(
    (term: string) => {
      setSearchTerm(term);
      applyFilters(fruits, term, selectedType);
    },
    [applyFilters, fruits, selectedType]
  );

  /**
   * Filtra frutas por tipo
   */
  const filterByType = useCallback(
    (type: typeof selectedType) => {
      setSelectedType(type);
      applyFilters(fruits, searchTerm, type);
    },
    [applyFilters, fruits, searchTerm]
  );

  /**
   * Limpia todos los filtros
   */
  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSelectedType("all");
    setFilteredFruits(fruits);
  }, [fruits]);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Obtiene una fruta específica por ID
   */
  const getFruitById = useCallback(
    async (id: number): Promise<Fruit | null> => {
      try {
        // Primero intenta encontrarla en la lista cargada
        const localFruit = fruits.find((fruit) => fruit.id === id);
        if (localFruit) {
          return localFruit;
        }

        // Si no está en la lista, hace la petición a la API
        const fruit = await FruitService.getFruitById(id);
        return fruit;
      } catch (err) {
        console.error("Error getting fruit by ID:", err);
        return null;
      }
    },
    [fruits]
  );

  // Cargar frutas al montar el componente
  useEffect(() => {
    fetchFruits();
  }, [fetchFruits]);

  // Reaplicar filtros cuando cambian las frutas
  useEffect(() => {
    applyFilters();
  }, [fruits, applyFilters]);

  return {
    // Datos
    fruits: filteredFruits,
    allFruits: fruits,

    // Estados
    loading,
    error,
    refreshing,

    // Filtros
    searchTerm,
    selectedType,

    // Acciones
    fetchFruits,
    refreshFruits,
    searchFruits,
    filterByType,
    clearFilters,
    clearError,
    getFruitById,

    // Estadísticas
    totalFruits: fruits.length,
    filteredCount: filteredFruits.length,

    // Tipos únicos disponibles
    availableTypes: [...new Set(fruits.map((fruit) => fruit.type))],
  };
};
