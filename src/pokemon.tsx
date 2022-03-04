import { Action, ActionPanel, List } from "@raycast/api";
import { useEffect, useState } from "react";
import groupBy from "lodash.groupby";
import PokemonDetail from "./components/detail";

import pokemons from "./statics/pokemons.json";

const listing = groupBy(pokemons, "generation");

type Generation = {
  [geneartion: string]: Pokemon[];
};

type Pokemon = {
  id: number;
  name: string;
  types: string[];
  artwork: string;
  generation: string;
};

export default function SearchPokemon() {
  const [nameOrId, setNameOrId] = useState<string>("");
  const [generation, setGeneration] = useState<Generation>(listing);

  useEffect(() => {
    let filtered = pokemons;
    if (nameOrId.length > 0) {
      filtered = pokemons.filter(
        (p: Pokemon) =>
          p.name.toLowerCase().includes(nameOrId.toLowerCase()) ||
          p.id === Number(nameOrId)
      );
    }
    const grouped = groupBy(filtered, "generation");
    setGeneration(grouped);
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
      {Object.entries(generation).map(([generation, pokemons]) => {
        return (
          <List.Section
            key={generation}
            title={generation}
            subtitle={pokemons.length.toString()}
          >
            {pokemons.map((pokemon) => (
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
