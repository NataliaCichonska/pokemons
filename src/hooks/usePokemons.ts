import useSWR from "swr";
import { fetcher } from "../utils/fetch";
import { useEffect, useMemo, useState } from "react";
import { Pokemon, PokemonType } from "../types/Pokemon";

const usePokemons = (searchTerm: string = "", selectedTypes: PokemonType[] = []) => {
    const { data, error, isLoading } = useSWR(
      "https://pokeapi.co/api/v2/pokemon?limit=25",
      fetcher
    );
  
    const [detailedPokemons, setDetailedPokemons] = useState<Pokemon[] | null>(
      null
    );
  
    useEffect(() => {
      if (!data?.results) return;
  
      const fetchDetails = async () => {
        try {
          const promises = data.results.map((p: { url: string }) =>
            fetcher(p.url)
          );
          const results = await Promise.all(promises);
          setDetailedPokemons(results);
        } catch (err) {
          console.error("Błąd pobierania szczegółów Pokémonów:", err);
        }
      };
  
      fetchDetails();
    }, [data]);
  
    const filteredPokemons = useMemo(() => {
        if (!detailedPokemons) return [];
    
        return detailedPokemons.filter((pokemon: Pokemon) => {
          const matchesName = searchTerm
            ? pokemon.name.toLowerCase().includes(searchTerm.toLowerCase())
            : true;
    
          const matchesType =
            selectedTypes.length === 0
              ? true
              : pokemon.types.some((t) =>
                  selectedTypes.some((st) => st.name === t.type.name)
                );
    
          return matchesName && matchesType;
        });
      }, [detailedPokemons, searchTerm, selectedTypes]);
  
    return {
      data: filteredPokemons,
      error,
      isLoading: isLoading || !detailedPokemons,
    };
  };
  
  export default usePokemons;
