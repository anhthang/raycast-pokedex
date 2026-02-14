import { getPreferenceValues, List } from "@raycast/api";
import json2md from "json2md";
import { Pokemon } from "../types";
import { filterPokemonForms, getPokemonImage } from "../utils";
import PokemonMetadata from "./metadata/pokemon";
import WeaknessMetadata from "./metadata/weakness";

const { artwork } = getPreferenceValues();

export default function PokemonForms(props: {
  id: number;
  name: string;
  pokemons: Pokemon[];
}) {
  const forms = filterPokemonForms(props.id, props.pokemons);

  return (
    <List
      throttle
      navigationTitle={`${props.name} | Forms`}
      isShowingDetail={true}
    >
      {forms.map((form, idx) => {
        const name =
          form.pokemonforms[0].pokemonformnames[0]?.pokemon_name ||
          form.pokemonforms[0].pokemonformnames[0]?.name ||
          props.name;

        const poke_id =
          artwork === "official" ? props.id : form.pokemonforms[0].pokemon_id;

        return (
          <List.Item
            key={idx}
            title={name}
            detail={
              <List.Item.Detail
                markdown={json2md([
                  {
                    img: [
                      {
                        title:
                          form.pokemonforms[0].pokemonformnames.find(
                            (n) => n.pokemon_name === form.name,
                          )?.name || form.pokemonforms[0].form_name,
                        source: getPokemonImage(poke_id, idx),
                      },
                    ],
                  },
                ])}
                metadata={
                  <List.Item.Detail.Metadata>
                    <PokemonMetadata pokemon={form} />
                    <List.Item.Detail.Metadata.Separator />
                    <WeaknessMetadata types={form.pokemontypes} />
                  </List.Item.Detail.Metadata>
                }
              />
            }
          />
        );
      })}
    </List>
  );
}
