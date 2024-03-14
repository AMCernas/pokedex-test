import React from "react"


interface Pokemon {
    name: string;
    sprites: {
      front_default?: string | null;
    };
  }
  
  interface Props {
    pokemon: Pokemon | null;
  }

const PokemonDetails: React.FC<Props> = ({ pokemon }) => {
    return(
        <div>
            <h2>{pokemon ? pokemon.name : 'no hay pokemon sleccionado'}</h2>
        </div>
    )
}

export {PokemonDetails}