import { List, ActionPanel, OpenInBrowserAction } from "@raycast/api";
import { useEffect, useState } from "react";

import PokeAPI, { Pokemon } from "pokedex-promise-v2";

const P = new PokeAPI();

function capitalize(name:string) {
  return name.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
    return letter.toUpperCase()
  })
}

export default function SearchResults() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    async function fetch() {
      const data: Pokemon | Pokemon[] | null = await P.getPokemonByName(search)
        .catch(() => {
          return null
        });

      if (Array.isArray(data)) {
        setPokemon(data[0])
      } else {
        setPokemon(data)
      }

      setLoading(false)
    }

    if (search.length > 0) {
      setLoading(true);
      fetch();
    }
  }, [search]);

  const onSearchChange = (newSearch: string) => {
    // backspace
    if (newSearch.length < search.length) {
      setPokemon(null)
    }
    setSearch(newSearch);
  };

  return (
    <List
      throttle
      isLoading={loading}
      onSearchTextChange={onSearchChange}
      searchBarPlaceholder="Search Pokémon by name or number..."
    >
      {pokemon && pokemon.id && (
        <List.Item
          key={pokemon.id}
          title={capitalize(pokemon.name)}
          subtitle={pokemon.types.map(t => capitalize(t.type.name)).join(', ')}
          accessoryTitle={`National №: ${pokemon.id}`}
          icon={{ source: pokemon.sprites.other["official-artwork"].front_default || '' }}
          actions={
            <ActionPanel>
              <OpenInBrowserAction url={`https://www.pokemon.com/us/pokedex/` + pokemon?.name} />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
