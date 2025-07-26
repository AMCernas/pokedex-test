import React, { useEffect, useState, useCallback } from "react";
import pokeball from "../images/klipartz.com.png";
import "./PokeballDisplay.css";
import { PokemonClient } from "pokenode-ts";

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
          };
        };
      };
    };
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
  };
  flavorText: string;
}

const PAGE_SIZE = 24;
const MAX_POKEMON = 130;
const TOTAL_PAGES = Math.ceil(MAX_POKEMON / PAGE_SIZE);

const PokeballDisplay: React.FC<PokeballDisplayProps> = ({ onPokemonSelect }) => {
  const [pokemonData, setPokemonData] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchPokemonData = useCallback(async () => {
    setLoading(true);
    try {
      const api = new PokemonClient();
      const start = (currentPage - 1) * PAGE_SIZE + 1;
      const end = Math.min(start + PAGE_SIZE - 1, MAX_POKEMON);

      const fetchedData: Pokemon[] = [];

      for (let i = start; i <= end; i++) {
        const response = await api.getPokemonById(i);
        const flavorText = await getPokemonFlavorText(response.species.url);

        fetchedData.push({
          name: response.name,
          id: response.id,
          sprites: {
            front_default: response.sprites.front_default,
            versions: {
              "generation-v": {
                "black-white": {
                  animated: {
                    front_default:
                      response.sprites.versions["generation-v"]["black-white"]
                        .animated.front_default,
                  },
                },
              },
            },
          },
          types: response.types,
          weight: response.weight,
          height: response.height,
          species: { url: response.species.url },
          flavorText,
        });
      }

      setPokemonData(fetchedData);
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [currentPage]);
  const getPokemonFlavorText = async (speciesUrl: string): Promise<string> => {
    try {
      const response = await fetch(speciesUrl);
      if (response.ok) {
        const data = await response.json();
        const flavorTextEntry = data.flavor_text_entries.find(
          (entry: any) => entry.language.name === "en"
        );
        return flavorTextEntry ? flavorTextEntry.flavor_text : "Flavor text not found";
      } else {
        console.error("Failed to fetch flavor text");
        return "Flavor text not found";
      }
    } catch (error) {
      console.error("Error fetching flavor text:", error);
      return "Flavor text not found";
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, [fetchPokemonData]);

  const handlePokemonClick = (pokemon: Pokemon) => {
    onPokemonSelect(pokemon);
    setSelectedPokemon(pokemon.name);
  };

  const handlePageChange = (direction: "next" | "prev") => {
    setSelectedPokemon(null);
    setPokemonData([]); 

    setCurrentPage((prev) => {
      if (direction === "next" && prev < TOTAL_PAGES) return prev + 1;
      if (direction === "prev" && prev > 1) return prev - 1;
      return prev;
    });
  };

  return (
    <div>
      {initialLoading ? (
        <div className="pokeball-display-loading-container">
          <img src={pokeball} alt="Loading..." className="pokeball-display-loading" />
        </div>
      ) : (
        <>

          <div className="pokemon-grid">
            {pokemonData.map((pokemon) => (
              <div
                key={pokemon.id}
                className="pokeball-display-container"
                onClick={() => handlePokemonClick(pokemon)}
              >
                <div className="image-container">
                  <img
                    src={pokeball}
                    alt=""
                    className={selectedPokemon === pokemon.name ? "rotated" : ""}
                  />
                </div>

                {pokemon.sprites.front_default ? (
                  <img
                    src={pokemon.sprites.front_default}
                    alt={pokemon.name}
                    className="pokemon-sprite"
                  />
                ) : (
                  <p>No sprite available</p>
                )}
              </div>
            ))}
          </div>

          {!loading && (
            <div className="pagination-controls">
              <button
                onClick={() => handlePageChange("prev")}
                disabled={currentPage === 1}
              >
                ← Previous
              </button>
              <span>
                Page {currentPage} of {TOTAL_PAGES}
              </span>
              <button
                onClick={() => handlePageChange("next")}
                disabled={currentPage === TOTAL_PAGES}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export { PokeballDisplay };