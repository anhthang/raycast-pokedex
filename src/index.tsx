import { List, ActionPanel, OpenInBrowserAction } from "@raycast/api";
import { useEffect, useState } from "react";

import PokeAPI, { Pokemon, PokemonSpecies } from "pokedex-promise-v2";

const P = new PokeAPI();

function capitalize(name: string) {
  return name.toLowerCase().replace(/\b[a-z](?=[a-z]{2})/g, function(letter) {
    return letter.toUpperCase()
  })
}

export default function SearchResults() {
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonSpecies, setPokemonSpecies] = useState<PokemonSpecies | null>(null);

  useEffect(() => {
    async function fetch() {
      await Promise.all([P.getPokemonByName(search), P.getPokemonSpeciesByName(search)])
        .then(([pokemon, pokemonSpecies]) => {
          setPokemon(Array.isArray(pokemon) ? pokemon[0] : pokemon)
          setPokemonSpecies(Array.isArray(pokemonSpecies) ? pokemonSpecies[0] : pokemonSpecies)
        })
        .catch(() => {
          setPokemon(null)
          setPokemonSpecies(null)
        });

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

  const abilities = pokemon?.abilities.map(a => {
    if (a.is_hidden) {
      return `${capitalize(a.ability.name)} (hidden)`
    }

    return capitalize(a.ability.name)
  }).join(', ')

  return (
    <List
      throttle
      isLoading={loading}
      onSearchTextChange={onSearchChange}
      searchBarPlaceholder="Search Pokémon by name or number..."
    >
      {pokemon && pokemon.id && (
        <>
          <List.Section>
            <List.Item
              key={pokemon.id}
              title={pokemonSpecies?.names.find(n => n.language.name === 'en')?.name || capitalize(pokemon.name)}
              // subtitle={pokemonSpecies?.flavor_text_entries.find(f => f.language.name === 'en')?.flavor_text.slice(0, 20)}
              subtitle={`#${pokemon.id.toString().padStart(3, '0')}`}
              icon={{ source: pokemon.sprites.other["official-artwork"].front_default || '' }}
              actions={
                <ActionPanel>
                  <OpenInBrowserAction url={`https://www.pokemon.com/us/pokedex/` + pokemon?.name} />
                </ActionPanel>
              }
            />
          </List.Section>
          <List.Section title="Pokédex data">
            <List.Item
              key="type"
              title="Type"
              subtitle={pokemon.types.map(t => capitalize(t.type.name)).join(', ')}
            />
            <List.Item
              key="height"
              title="Height"
              subtitle={`${pokemon.height / 10}m`}
            />
            <List.Item
              key="weight"
              title="Weight"
              subtitle={`${pokemon.weight / 10}kg`}
            />
            <List.Item
              key="abilities"
              title="Abilities"
              subtitle={abilities}
            />
          </List.Section>
        </>
      )}
    </List>
  );
}
