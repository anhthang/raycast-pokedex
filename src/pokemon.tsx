import {
  Action,
  ActionPanel,
  Grid,
  Icon,
  getPreferenceValues,
} from "@raycast/api";
import groupBy from "lodash.groupby";
import orderBy from "lodash.orderby";
import { useMemo, useState } from "react";
import PokemonDetail from "./components/detail";
import TypeDropdown from "./components/type_dropdown";
import pokedex from "./statics/pokedex.json";
import { getOfficalArtworkImg, getPixelArtImg, localeName } from "./utils";

const { language, artwork } = getPreferenceValues();
let columns: number;

let getContent: (id: number, formId?: number) => string;
switch (artwork) {
  case "pixel":
    getContent = getPixelArtImg;
    columns = 6;
    break;
  default:
    getContent = getOfficalArtworkImg;
    break;
}

export default function SearchPokemon() {
  const [type, setType] = useState<string>("all");
  const [sort, setSort] = useState<string>("lowest");

  const pokemons = useMemo(() => {
    const sorted = orderBy(pokedex, ...sort.split("|"));

    return type != "all"
      ? sorted.filter((p) => p.types.includes(type))
      : sorted;
  }, [type, sort]);

  return (
    <Grid
      throttle
      columns={columns}
      searchBarPlaceholder="Search for Pokémon by name or Pokédex number"
      searchBarAccessory={
        <TypeDropdown type="grid" command="Pokémon" onSelectType={setType} />
      }
    >
      {Object.entries(groupBy(pokemons, "generation")).map(
        ([generation, pokemonList]) => {
          return (
            <Grid.Section title={generation} key={generation}>
              {pokemonList.map((pokemon) => {
                return (
                  <Grid.Item
                    key={pokemon.id}
                    content={getContent(pokemon.id)}
                    title={localeName(pokemon, language)}
                    subtitle={`#${pokemon.id.toString().padStart(4, "0")}`}
                    keywords={[pokemon.id.toString(), pokemon.name]}
                    actions={
                      <ActionPanel>
                        <ActionPanel.Section title="Information">
                          <Action.Push
                            title="View Details"
                            icon={Icon.Sidebar}
                            target={<PokemonDetail id={pokemon.id} />}
                          />
                        </ActionPanel.Section>
                        <ActionPanel.Section title="Sort By">
                          <Action
                            title="Number (Lowest First)"
                            icon={Icon.ArrowUp}
                            onAction={() => setSort("id|asc")}
                          />
                          <Action
                            title="Number (Highest First)"
                            icon={Icon.ArrowDown}
                            onAction={() => setSort("id|desc")}
                          />
                          <Action
                            title="Name (A-Z)"
                            icon={Icon.Text}
                            onAction={() => setSort("name|asc")}
                          />
                          <Action
                            title="Name (Z-A)"
                            icon={Icon.Text}
                            onAction={() => setSort("name|desc")}
                          />
                        </ActionPanel.Section>
                      </ActionPanel>
                    }
                  />
                );
              })}
            </Grid.Section>
          );
        },
      )}
    </Grid>
  );
}
