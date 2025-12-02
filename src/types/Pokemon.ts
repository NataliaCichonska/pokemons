import typeColors from "../utils/colors";

export interface PokemonType {
    name: keyof typeof typeColors;
  };

export interface Pokemon {
    id: number;
    name: string;
    url: string;
    sprites: {
      front_default: string;
      back_default: string;
      front_shiny: string;
      back_shiny: string;
    };
    height?: number;
    weight?: number;
    stats?: [any];
    types: {
      type: PokemonType
      
    }[];
  }