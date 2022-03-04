import { Action, ActionPanel, List } from "@raycast/api";
import { useMemo, useState } from "react";
import groupBy from "lodash.groupby";
import PokemonDetail from "./components/detail";

import pokemons from "./statics/pokemons.json";

export default function SearchPokemon() {
  const [nameOrId, setNameOrId] = useState<string>("");

  const generations = useMemo(() => {
    const listing = nameOrId
      ? pokemons.filter(
          (p) =>
            p.name.toLowerCase().includes(nameOrId.toLowerCase()) ||
            p.id === Number(nameOrId)
        )
      : pokemons;

    return groupBy(listing, "generation");
  }, [nameOrId]);

  return (
    <List
      throttle
      onSearchTextChange={(text) => setNameOrId(text)}
      searchBarPlaceholder="Search Pokémon by name or number..."
    >
      {!nameOrId && (
        <List.Section>
          <List.Item
            key="surprise"
            title="Surprise Me!"
            accessoryTitle="Random Pokémon selector"
            icon="icon_random.png"
            actions={
              <ActionPanel>
                <Action.Push
                  title="Surprise Me!"
                  icon="icon_random.png"
                  target={<PokemonDetail />}
                />
              </ActionPanel>
            }
          />
        </List.Section>
      )}
      {Object.entries(generations).map(([generation, pokemonList]) => {
        return (
          <List.Section
            key={generation}
            title={generation}
            subtitle={pokemonList.length.toString()}
          >
            {pokemonList.map((pokemon) => (
              <List.Item
                key={pokemon.id}
                title={`#${pokemon.id.toString().padStart(3, "0")}`}
                subtitle={pokemon.name}
                accessoryTitle={pokemon.types.join(", ")}
                accessoryIcon={`types/${pokemon.types[0]}.png`}
                icon={{
                  source: pokemon.artwork,
                  fallback: "icon.png",
                }}
                actions={
                  <ActionPanel>
                    <Action.Push
                      title="Show Details"
                      icon="icon_random.png"
                      target={<PokemonDetail id={pokemon.id} />}
                    />
                  </ActionPanel>
                }
              />
            ))}
          </List.Section>
        );
      })}
    </List>
  );
}
