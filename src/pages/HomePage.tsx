import { useState } from "react";
import useDebounce from "../hooks/useDebounce";
import usePokemons from "../hooks/usePokemons";
import useSWR from "swr";
import { fetcher } from "../utils/fetch";
import typeColors from "../utils/colors";
import PokemonCard from "../components/PokemonCard";
import { Pokemon, PokemonType } from "../types/Pokemon";

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchTerm);
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const { data, error, isLoading } = usePokemons(
    debouncedSearchTerm,
    selectedTypes
  );
  const { data: typesData } = useSWR("https://pokeapi.co/api/v2/type", fetcher);

  const toggleType = (type: PokemonType) => {
    setSelectedTypes((prev: PokemonType[]) =>
      prev.includes(type)
        ? prev.filter((t: PokemonType) => t !== type)
        : [...prev, type]
    );
  };
  console.log(typesData, "---", selectedTypes);
  return (
    <div className="homepage-container">
      <h1>
        <img src="poke-ball.png" height="2em"></img>
        <span>Pokemon explorer</span>
      </h1>
      <input
        type="text"
        placeholder="Search Pokemon..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pokemon-input"
      />
      <div className="types-container">
        {typesData?.results?.map((type: { name: keyof typeof typeColors }) => (
          <button
            key={type.name}
            onClick={() => toggleType(type)}
            style={{ backgroundColor: typeColors[type.name] }}
            className={`type-button ${
              selectedTypes.includes(type) ? "selected" : ""
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>
      <div className="pokemon-grid">
        {data?.length === 0 && <p>No Pokemons found.</p>}
        {isLoading && <p>Loading...</p>}
        {error && <p>Error loading Pokemons.</p>}
        {data?.map((pokemon: Pokemon) => (
          <PokemonCard key={pokemon.name} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
