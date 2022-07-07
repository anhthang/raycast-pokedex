import { List } from "@raycast/api";
import json2md from "json2md";
import { PokemonV2Pokemonspeciesflavortext } from "../types";

export default function PokedexEntries(props: {
  name: string;
  entries: PokemonV2Pokemonspeciesflavortext[];
}) {
  return (
    <List
      throttle
      navigationTitle={`${props.name} | Pokédex Entries`}
      isShowingDetail={Boolean(props.entries.length)}
    >
      {props.entries.map((entry, idx) => {
        const title =
          entry.pokemon_v2_version.pokemon_v2_versionnames[0]?.name ||
          entry.pokemon_v2_version.name;
        return (
          <List.Item
            key={idx}
            title={title}
            detail={
              <List.Item.Detail
                markdown={json2md([
                  {
                    h1: title,
                  },
                  {
                    p: entry.flavor_text
                      .split("\n")
                      .join(" ")
                      .split("")
                      .join(" "),
                  },
                ])}
              />
            }
          />
        );
      })}
    </List>
  );
}
