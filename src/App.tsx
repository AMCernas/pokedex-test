import React, { useEffect, useState } from 'react';
import './App.css';
import { PokeballDisplay } from './components/PokeballDisplay';
import { Pokemon } from './components/PokeballDisplay';
import PokemonData from './components/PokemonData';

function App() {
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  
  return (
    <div className="App">
      <div className='container'>

        <div className='containerLeft'>
          <div className='outerContainerLeft'>
            <div className='innerContainerLeft'>
              <PokeballDisplay onPokemonSelect={setSelectedPokemon} />
            </div>
          </div>
        </div>

        <div className='containerRight'>
          <div className='outerContainerRight'>
            <div className='innerContainerRight'>
              <PokemonData pokemon={selectedPokemon}/>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;