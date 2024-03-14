import React, { useEffect, useState } from "react";
import pokeball from '../images/klipartz.com.png';
import './PokeballDisplay.css'
import { PokemonClient } from 'pokenode-ts';

type PokeballDisplayProps = {
  onPokemonSelect: (pokemon: Pokemon) => void;
};

export interface Pokemon {
  name: string;
  id: number;
  sprites: {
    front_default?: string | null;
    versions: {
      "generation-v": {
        "black-white": {
          animated: {
            front_default?: string | null;
          }
        }
      }
    }
  };
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  weight: number;
  height: number;
  species: {
    url: string;
  }
  flavorText: string; 
}


const PokeballDisplay: React.FC<PokeballDisplayProps> = ({ onPokemonSelect }) => {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPokemonData = async () => {
      const api = new PokemonClient();
      const pokemonDataArray: Pokemon[] = [];

      try {
        for (let i = 1; i <= 151; i++) {
          const pokemonResponse = await api.getPokemonById(i);
          const flavorText = await getPokemonFlavorText(pokemonResponse.species.url); 
          const pokemon: Pokemon = {
            name: pokemonResponse.name,
            id: pokemonResponse.id,
            sprites: {
              front_default: pokemonResponse.sprites.front_default,
              versions: {
                "generation-v": {
                  "black-white": {
                    animated: {
                      front_default: pokemonResponse.sprites.versions["generation-v"]["black-white"].animated.front_default
                    }
                  }
                }
              }
            },
            types: pokemonResponse.types,
            weight: pokemonResponse.weight,
            height: pokemonResponse.height,
            species: {
              url: pokemonResponse.species.url
            },
            flavorText: flavorText 
          };
          pokemonDataArray.push(pokemon);
        }

        setPokemonData(pokemonDataArray);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, []);

  const handlePokemonClick = (pokemon: Pokemon) => {
    console.log("Pokemon selected:", pokemon);
    onPokemonSelect(pokemon); 
  };

  const getPokemonFlavorText = async (speciesUrl: string): Promise<string> => {
    try {
      const response = await fetch(speciesUrl);
      if (response.ok) {
        const data = await response.json();
        const flavorTextEntry = data.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
        return flavorTextEntry ? flavorTextEntry.flavor_text : 'Flavor text not found';
      } else {
        console.error("Failed to fetch flavor text");
        return 'Flavor text not found';
      }
    } catch (error) {
      console.error("Error fetching flavor text:", error);
      return 'Flavor text not found';
    }
  };

  if (loading) {
    return  <div className="pokeball-display-loading-container">
              <img src={pokeball} alt="" className="pokeball-display-loading"/>
            </div>;  
  }

return (
  <div>
    {pokemonData.map((pokemon: Pokemon, index: number) => (
      <div key={index} className={'pokeball-display-container'} onClick={() => handlePokemonClick(pokemon)}>
        <img src={pokeball} alt="" className={'pokeball'} />
        {pokemon.sprites.front_default ? (
          <img src={pokemon.sprites.front_default} alt={pokemon.name} className={'pokemon-sprite'} />
        ) : (
          <p>No sprite available</p>
        )}
      </div>
    ))}
  </div>
);
}

export { PokeballDisplay };