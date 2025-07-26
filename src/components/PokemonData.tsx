import { Pokemon } from "./PokeballDisplay"
import pokeballbit from '../images/pokeballbit.png';
import { typeColors} from '../constants/typeColors';
import './PokemonData.css'

interface PokemonDataProps {
    pokemon: Pokemon | null; 
}

const PokemonData: React.FC<PokemonDataProps> = ({ pokemon }) => {

function cleanFlavorText(text: string): string {
  return text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/([.?!])(?=\S)/g, '$1 ') 
    .replace(/\s+/g, ' ')      
    .trim();
}

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
                </div>
                <div className="pokemonData-Container-Right">
                  <div className="data1Container">
                  <p className="data1"> <img src={pokeballbit} alt="" className="pokeballbit" />{pokemon.id} {pokemon.name}</p>
                  </div>
                  <ul className="pokemonData-types">
                    {pokemon.types.map((type, index) => (
                      <li key={index} className="pokemonData-type" style={{backgroundColor: typeColors[type.type.name as keyof typeof typeColors]}}> {type.type.name} </li>
                    ))}
                  </ul>
                  <div className="data2Container">
                  <div className="data2">
                  <p className="height">HT {pokemon.height/10} M</p>
                  <p className="weight">WH {pokemon.weight/10} K</p>
                  </div>
                  <p className="flavorText">
                    {cleanFlavorText(pokemon.flavorText)}
                  </p>
                  </div>
                </div>                  
              </div>

              </div>
            )} 
        </div>
        
    )

}

export default PokemonData

