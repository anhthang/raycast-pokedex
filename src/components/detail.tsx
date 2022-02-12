import { ActionPanel, Detail, OpenInBrowserAction } from "@raycast/api";
import { useEffect, useState } from "react";
import json2md from "json2md";
import { getPokemon } from "../api";
import type { PokemonV2Pokemon, PokemonV2Pokemonspecy } from "../types";

type PropsType = {
  id: number;
  name: string;
};

export default function PokemonDetail(props: PropsType) {
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemons, setPokemons] = useState<PokemonV2Pokemon[]>([]);

  useEffect(() => {
    setLoading(true);
    getPokemon(props.id)
      .then((data) => {
        setPokemons(data);
        setLoading(false);
      })
      .catch(() => {
        setPokemons([]);
        setLoading(false);
      });
  }, [props.id]);

  const accessoryTitle = (specy: PokemonV2Pokemonspecy): string => {
    if (specy.is_baby) return "Baby";
    if (specy.is_legendary) return "Legendary";
    if (specy.is_mythical) return "Mythical";

    return "";
  };

  const abilities = (pkm: PokemonV2Pokemon) =>
    pkm.pokemon_v2_pokemonabilities_aggregate.nodes
      .map((a) => {
        if (a.is_hidden) {
          return `${a.pokemon_v2_ability.pokemon_v2_abilitynames[0].name} (hidden)`;
        }

        return a.pokemon_v2_ability.pokemon_v2_abilitynames[0].name;
      })
      .join(", ");

  const pkmNumber = (id: number) => {
    return id.toString().padStart(3, "0");
  };

  const markdown = (pokemon: PokemonV2Pokemon): string | null => {
    if (!pokemon) return null;

    const {
      pokemon_v2_pokemonspecy,
      pokemon_v2_pokemontypes_aggregate,
      pokemon_v2_pokemonstats_aggregate,
    } = pokemon;
    const data = [
      {
        h1: pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0].name,
      },
      {
        blockquote: accessoryTitle(pokemon_v2_pokemonspecy),
      },
      {
        img: [
          {
            title:
              pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames[0].name,
            source: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pkmNumber(
              pokemon.id
            )}.png`,
          },
        ],
      },
      {
        h2: "Pokédex data",
      },
      {
        p:
          "_Type:_ " +
          pokemon_v2_pokemontypes_aggregate.nodes
            .map((n) => n.pokemon_v2_type.pokemon_v2_typenames[0].name)
            .join(", "),
      },
      { p: `_Height:_ ${pokemon.height / 10}m` },
      { p: `_Weight:_ ${pokemon.weight / 10}kg` },
      { p: `_Abilities:_ ${abilities(pokemon)}` },
      {
        h2: "Base stats",
      },
      ...pokemon_v2_pokemonstats_aggregate.nodes.map((n) => {
        return {
          p: `_${n.pokemon_v2_stat.pokemon_v2_statnames[0].name}_: ${n.base_stat}`,
        };
      }),
      {
        p: `Total: **${pokemon_v2_pokemonstats_aggregate.aggregate.sum.base_stat}**`,
      },
      {
        h2: "Pokédex entries",
      },
      ...pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesflavortexts
        .filter((f) => f.pokemon_v2_version.pokemon_v2_versionnames.length)
        .map((flavor) => {
          return {
            p: `**${
              flavor.pokemon_v2_version.pokemon_v2_versionnames[0].name
            }:** ${flavor.flavor_text.split("\n").join(" ")}`,
          };
        }),
    ];

    return json2md(data);
  };

  return (
    <Detail
      isLoading={loading}
      navigationTitle={props.name}
      markdown={markdown(pokemons[0])}
      actions={
        <ActionPanel>
          <OpenInBrowserAction
            url={`https://www.pokemon.com/us/pokedex/${props.name.toLowerCase()}`}
          />
        </ActionPanel>
      }
    />
  );
}
