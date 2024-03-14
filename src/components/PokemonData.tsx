import { Pokemon } from "./PokeballDisplay"
import './PokemonData.css'

interface PokemonDataProps {
    pokemon: Pokemon | null; 
}

const PokemonData: React.FC<PokemonDataProps> = ({ pokemon }) => {

    return (
        <div>
            {pokemon && ( 
              <div>
                <div className="pokemonData-Container">
                <div className="pokemonData-Container-Left">
                  {pokemon.sprites.versions?.['generation-v']?.['black-white']?.animated?.front_default && (
                    <div className="spriteContainer">
                    <img src={pokemon.sprites.versions['generation-v']['black-white'].animated.front_default} alt={pokemon.name} className="pokemonData-Sprite" />
                    </div>
                  )}
                  <p>No. {pokemon.id}</p>
                </div>
                <div className="pokemonData-Container-Right">
                  <p>{pokemon.name}</p>
                  <p>HT {pokemon.height/10}M</p>
                  <p>WH {pokemon.weight/10}K</p>
                  <ul className="pokemonData-types">
                    {pokemon.types.map((type, index) => (
                      <li key={index} className="pokemonData-type" >{type.type.name}</li>
                    ))}
                  </ul>
                </div>                  
              </div>
              <div className="entryData-Container">
                <p>{pokemon.flavorText}</p>
              </div>
              </div>
            )} 
        </div>
        
    )

}

export default PokemonData

