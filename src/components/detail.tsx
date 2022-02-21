import { Action, ActionPanel, Detail, getPreferenceValues } from "@raycast/api";
import { useEffect, useState } from "react";
import json2md from "json2md";
import { getPokemon } from "../api";
import {
  PokemonV2Pokemon,
  PokemonV2Pokemonspecy,
  PokemonV2Pokemonspeciesname,
} from "../types";

const { language } = getPreferenceValues();

type SpeciesNameByLanguage = {
  [lang: string]: PokemonV2Pokemonspeciesname;
};

function random(lower: number, upper: number) {
  return lower + Math.floor(Math.random() * (upper - lower + 1));
}

export default function PokemonDetail(props: { id?: number }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<PokemonV2Pokemon | undefined>(
    undefined
  );
  const [nameByLang, setNameByLang] = useState<SpeciesNameByLanguage>({});

  useEffect(() => {
    setLoading(true);
    getPokemon(props.id || random(1, 898), Number(language))
      .then((data) => {
        if (data[0]) {
          const nameMap =
            data[0].pokemon_v2_pokemonspecy.pokemon_v2_pokemonspeciesnames.reduce(
              (prev, curr) => {
                prev[curr.language_id] = curr;

                return prev;
              },
              nameByLang
            );

          setNameByLang(nameMap);
        }
        setPokemon(data[0]);
        setLoading(false);
      })
      .catch(() => {
        setPokemon(undefined);
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
    pkm.pokemon_v2_pokemonabilities
      .map((a) => {
        if (a.is_hidden) {
          return `${a.pokemon_v2_ability.pokemon_v2_abilitynames[0].name} (hidden)`;
        }

        return a.pokemon_v2_ability.pokemon_v2_abilitynames[0].name;
      })
      .join(", ");

  const formImg = (id: number, formId: number) => {
    const name = formId
      ? `${id.toString().padStart(3, "0")}_f${formId + 1}`
      : id.toString().padStart(3, "0");
    return `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${name}.png`;
  };

  const dataObject = (
    pokemon: PokemonV2Pokemon | undefined
  ): json2md.DataObject => {
    if (!pokemon) return [];

    const {
      pokemon_v2_pokemonspecy,
      pokemon_v2_pokemontypes,
      pokemon_v2_pokemonstats,
    } = pokemon;

    const { pokemon_v2_evolutionchain, pokemon_v2_pokemonspeciesflavortexts } =
      pokemon_v2_pokemonspecy;

    const pkmNumber = pokemon.id.toString().padStart(3, "0");

    const data = [
      {
        h1: nameByLang[language].name,
      },
      {
        blockquote: accessoryTitle(pokemon_v2_pokemonspecy),
      },
      {
        img: [
          {
            title: nameByLang[language].name,
            source: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${pkmNumber}.png`,
          },
        ],
      },
      {
        h2: "Pokédex data",
      },
      {
        p: `_National №:_ ${pkmNumber}`,
      },
      {
        p:
          "_Type:_ " +
          pokemon_v2_pokemontypes
            .map((n) => n.pokemon_v2_type.pokemon_v2_typenames[0].name)
            .join(", "),
      },
      { p: `_Species:_ ${nameByLang[language].genus}` },
      { p: `_Height:_ ${pokemon.height / 10}m` },
      { p: `_Weight:_ ${pokemon.weight / 10}kg` },
      { p: `_Abilities:_ ${abilities(pokemon)}` },
      {
        h2: "Base stats",
      },
      ...pokemon_v2_pokemonstats.map((n) => {
        return {
          p: `_${n.pokemon_v2_stat.pokemon_v2_statnames[0].name}_: ${n.base_stat}`,
        };
      }),
      {
        p: `Total: **${pokemon_v2_pokemonstats.reduce(
          (prev, cur) => prev + cur.base_stat,
          0
        )}**`,
      },
      {
        h2:
          pokemon_v2_pokemonspecy.pokemon_v2_pokemons.length > 1 ? "Forms" : "",
      },
      ...(pokemon_v2_pokemonspecy.pokemon_v2_pokemons.length > 1
        ? pokemon_v2_pokemonspecy.pokemon_v2_pokemons.map((p, idx) => {
            return [
              {
                h3:
                  p.pokemon_v2_pokemonforms[0].pokemon_v2_pokemonformnames[0]
                    ?.name || nameByLang[language].name,
              },
              {
                img: [
                  {
                    title:
                      p.pokemon_v2_pokemonforms[0]
                        .pokemon_v2_pokemonformnames[0]?.name ||
                      nameByLang[language].name,
                    source: formImg(pokemon.id, idx),
                  },
                ],
              },
            ];
          })
        : []),
      {
        h2: "Evolutions",
      },
      {
        p:
          pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.length < 2
            ? "_This Pokémon does not evolve._"
            : "",
      },
      {
        img:
          pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.length < 2
            ? []
            : pokemon_v2_evolutionchain.pokemon_v2_pokemonspecies.map(
                (specy) => {
                  return {
                    title: specy.pokemon_v2_pokemonspeciesnames[0].name,
                    source: `https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${specy.id
                      .toString()
                      .padStart(3, "0")}.png`,
                  };
                }
              ),
      },
      {
        h2: "Pokédex entries",
      },
      ...pokemon_v2_pokemonspeciesflavortexts
        .filter((f) => f.pokemon_v2_version.pokemon_v2_versionnames.length)
        .map((flavor) => {
          return {
            p: `**${
              flavor.pokemon_v2_version.pokemon_v2_versionnames[0].name
            }:** ${flavor.flavor_text.split("\n").join(" ")}`,
          };
        }),
    ];

    return data;
  };

  const englishName = () => {
    // 9 is language_id for English
    return nameByLang["9"].name.replace(/ /g, "_");
  };

  return (
    <Detail
      isLoading={loading}
      navigationTitle={
        pokemon ? `${nameByLang[language].name} | Pokédex` : "Pokédex"
      }
      markdown={json2md(dataObject(pokemon))}
      actions={
        pokemon && (
          <ActionPanel>
            <ActionPanel.Section title="Pokémon">
              <Action.OpenInBrowser
                title="Open in the Official Pokémon Website"
                icon="pokemon.ico"
                url={`https://www.pokemon.com/us/pokedex/${pokemon.pokemon_v2_pokemonspecy.name}`}
              />
              <Action.OpenInBrowser
                title="Open in Bulbapedia"
                icon="bulbapedia.ico"
                url={`https://bulbapedia.bulbagarden.net/wiki/${englishName()}_(Pok%C3%A9mon)`}
              />
            </ActionPanel.Section>
          </ActionPanel>
        )
      }
    />
  );
}
