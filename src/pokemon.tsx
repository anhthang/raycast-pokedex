import { Action, ActionPanel, Grid, Icon } from "@raycast/api";
import { useMemo, useState } from "react";
import groupBy from "lodash.groupby";
import PokemonDetail from "./components/detail";

import pokemons from "./statics/pokemons.json";

const types = [
  "Normal",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Psychic",
  "Bug",
  "Rock",
  "Ghost",
  "Dragon",
  "Dark",
  "Steel",
  "Fairy",
];

export default function SearchPokemon() {
  const [type, setType] = useState<string>("all");

  const listing = useMemo(() => {
    return type != "all"
      ? pokemons.filter((p) => p.types.includes(type))
      : pokemons;
  }, [type]);

  return (
    <Grid
      throttle
      searchBarPlaceholder="Search Pokémon by name or number..."
      searchBarAccessory={
        <Grid.Dropdown
          tooltip="Pokémon Type Filter"
          storeValue={true}
          onChange={(val) => setType(val)}
        >
          <Grid.Dropdown.Item
            key="all"
            value="all"
            title="All Types"
            icon="pokeball.svg"
          />
          <Grid.Dropdown.Section>
            {types.map((type) => {
              return (
                <Grid.Dropdown.Item
                  key={type}
                  value={type}
                  title={type}
                  icon={`types/${type.toLowerCase()}.svg`}
                />
              );
            })}
          </Grid.Dropdown.Section>
        </Grid.Dropdown>
      }
    >
      {Object.entries(groupBy(listing, "generation")).map(
        ([generation, pokemonList]) => {
          return (
            <Grid.Section title={generation} key={generation}>
              {pokemonList.map((pokemon) => {
                return (
                  <Grid.Item
                    key={pokemon.id}
                    content={pokemon.artwork}
                    title={pokemon.name}
                    subtitle={`#${pokemon.id.toString().padStart(3, "0")}`}
                    keywords={[pokemon.id.toString(), pokemon.name]}
                    actions={
                      <ActionPanel>
                        <Action.Push
                          title="Show Details"
                          icon={Icon.Sidebar}
                          target={<PokemonDetail id={pokemon.id} />}
                        />
                      </ActionPanel>
                    }
                  />
                );
              })}
            </Grid.Section>
          );
        }
      )}
    </Grid>
  );
}
