import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import typeColors from "../utils/colors";
import { Pokemon } from "../types/Pokemon";

interface Props {
  open: boolean;
  onClose: () => void;
  pokemon: Pokemon | null;
}

interface Evolution {
  name: string;
  sprite: string;
}

const PokemonModal = ({ open, onClose, pokemon }: Props) => {
  const [evolutions, setEvolutions] = useState<Evolution[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    if (!pokemon) return;

    const fetchDetails = async () => {
      try {
        const locRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemon.id}/encounters`
        );
        const locData = await locRes.json();
        setLocations(locData.map((l: any) => l.location_area.name));

        const speciesRes = await fetch(
          `https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`
        );
        const speciesData = await speciesRes.json();
        if (speciesData.evolution_chain?.url) {
          const evoRes = await fetch(speciesData.evolution_chain.url);
          const evoData = await evoRes.json();
          const evoList: Evolution[] = [];

          const traverse = (chain: any) => {
            evoList.push({ name: chain.species.name, sprite: "" }); // sprite uzupełnimy później
            if (chain.evolves_to?.length > 0) {
              chain.evolves_to.forEach((next: any) => traverse(next));
            }
          };
          traverse(evoData.chain);

          const evoWithSprites = await Promise.all(
            evoList.map(async (evo) => {
              const pRes = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${evo.name}`
              );
              const pData = await pRes.json();
              return { name: evo.name, sprite: pData.sprites.front_default };
            })
          );
          setEvolutions(evoWithSprites);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [pokemon]);

  if (!pokemon) return null;

  const bgColors =
    pokemon?.types?.length > 1
      ? `linear-gradient(135deg, ${pokemon.types
          .map((t) => typeColors[t.type.name])
          .join(", ")})`
      : typeColors[pokemon?.types?.[0]?.type?.name];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ position: "relative", backgroundColor: "black" }}>
        <h3 style={{ color: "white", textTransform: "capitalize" }}>
          {pokemon.name} #{String(pokemon.id).padStart(3, "0")}
        </h3>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8, color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent
        sx={{
          background: bgColors,
          color: "white",
          padding: 2,
        }}
      >
        <Grid
          container
          spacing={2}
          justifyContent="center"
          sx={{ marginBottom: 2 }}
        >
          <div>
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>
          <div>
            <img src={pokemon.sprites.back_default} alt={pokemon.name} />
          </div>
          <div>
            <img src={pokemon.sprites.front_shiny} alt={pokemon.name} />
          </div>
          <div>
            <img src={pokemon.sprites.back_shiny} alt={pokemon.name} />
          </div>
        </Grid>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5em",
            flexWrap: "wrap",
            marginBottom: "1em",
          }}
        >
          {pokemon.types.map((t) => (
            <span
              key={t.type.name}
              style={{
                backgroundColor: typeColors[t.type.name],
                color: "white",
                borderRadius: "1em",
                padding: "0.5em 1em",
                textTransform: "capitalize",
                fontWeight: "bold",
              }}
            >
              {t.type.name}
            </span>
          ))}
        </div>
        <h3>Stats:</h3>
        <ul>
          {pokemon?.stats?.map((stat) => (
            <li key={stat.stat.name}>
              {stat.stat.name}: {stat.base_stat}
            </li>
          ))}
        </ul>
        {evolutions.length > 0 && (
          <>
            <h3>Evolutions:</h3>
            <Grid container spacing={2} justifyContent="center">
              {evolutions.map((evo) => (
                <div key={evo.name}>
                  <img
                    src={evo.sprite}
                    alt={evo.name}
                    style={{ width: 80, height: 80 }}
                  />
                  <Typography
                    variant="body2"
                    textTransform="capitalize"
                    align="center"
                  >
                    {evo.name}
                  </Typography>
                </div>
              ))}
            </Grid>
          </>
        )}
        {locations.length > 0 && (
          <>
            <h3>Locations:</h3>
            <ul>
              {locations.map((loc) => (
                <li key={loc}>{loc.replace("-", " ")}</li>
              ))}
            </ul>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PokemonModal;
