import { Pokemon, PokemonType } from "../types/Pokemon";
import typeColors from "../utils/colors";
import { useState } from "react";
import PokemonModal from "./PokemonModal";

const PokemonCard = ({ pokemon }: { pokemon: Pokemon }) => {
  const [open, setOpen] = useState<boolean>(false);
  if (!pokemon) return null;

  const bgColors =
    pokemon?.types?.length > 1
      ? `linear-gradient(135deg, ${pokemon.types
          .map((t) => typeColors[t.type.name])
          .join(", ")})`
      : typeColors[pokemon?.types?.[0]?.type?.name];

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <div
        className="pokemon-box"
        style={{
          background: bgColors,
        }}
        onClick={handleOpen}
      >
        <img src={pokemon?.sprites?.front_default} alt={pokemon?.name} />

        <h2>{pokemon?.name}</h2>
        <p>#{String(pokemon.id).padStart(3, "0")}</p>
        <div className="pokemon-types">
          {pokemon?.types?.map((t: { type: PokemonType }) => (
            <span
              key={t?.type.name}
              className="pokemon-type"
              style={{
                backgroundColor: "rgba(255,255,255,0.3)",
              }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
      </div>
      <PokemonModal open={open} onClose={handleClose} pokemon={pokemon} />
    </>
  );
};

export default PokemonCard;
