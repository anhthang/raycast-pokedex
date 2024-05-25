import { List, getPreferenceValues } from "@raycast/api";
import json2md from "json2md";
import { useEffect, useState, useCallback } from "react";
import { getPokemon } from "../api";
import { PokemonV2Pokemon, PokemonV2Pokemontype } from "../types";
import { typeColor } from "./detail";
import pokedex from "../statics/pokedex.json";
import damageRelations from "../statics/damage_relations.json";
import debounce from "lodash.debounce";

export default function PokemonWeaknesses(props: { id: number }) {
  const { language } = getPreferenceValues();
  const [pokemon, setPokemon] = useState<PokemonV2Pokemon | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);
  const [effectiveness, setEffectiveness] = useState<{
    normal: string[];
    weak: string[];
    immune: string[];
    resistant: string[];
  }>({ normal: [], weak: [], immune: [], resistant: [] });

  const [selectedPokemonId, setSelectedPokemonId] = useState(props.id);
  const [pokemonName, setPokemonName] = useState<string | undefined>(undefined);

  useEffect(() => {
    setLoading(true);
    getPokemon(selectedPokemonId, Number(language))
      .then((data) => {
        const fetchedPokemon = data[0];
        setPokemon(fetchedPokemon);
        setPokemonName(
          fetchedPokemon.name.charAt(0).toUpperCase() +
            fetchedPokemon.name.slice(1)
        );
        const typeEffectiveness = calculateEffectiveness(
          fetchedPokemon.pokemon_v2_pokemontypes
        );
        setEffectiveness(typeEffectiveness);
        setLoading(false);
      })
      .catch(() => {
        setPokemon(undefined);
        setLoading(false);
      });
  }, [selectedPokemonId]);

  const calculateEffectiveness = (types: PokemonV2Pokemontype[]) => {
    const effectivenessMap = new Map<string, number>();
    Object.entries(damageRelations).forEach(([key, value]) =>
      types.forEach((type) => {
        if (key == type.pokemon_v2_type.name) {
          const typeEffectiveness = value;
          if (typeEffectiveness) {
            value.double_damage_from.forEach((relation) => {
              const currentFactor = effectivenessMap.get(relation.name) || 1;
              effectivenessMap.set(relation.name, currentFactor * 2);
            });
            value.half_damage_from.forEach((relation) => {
              const currentFactor = effectivenessMap.get(relation.name) || 1;
              effectivenessMap.set(relation.name, currentFactor * 0.5);
            });
            value.no_damage_from.forEach((relation) => {
              const currentFactor = effectivenessMap.get(relation.name) || 1;
              effectivenessMap.set(relation.name, currentFactor * 0);
            });
          }
        }
      })
    );

    const normal: string[] = [];
    const weak: string[] = [];
    const immune: string[] = [];
    const resistant: string[] = [];

    effectivenessMap.forEach((factor, typeName) => {
      if (factor > 1) {
        weak.push(
          `${factor}x ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`
        );
      } else if (factor < 1 && factor > 0) {
        resistant.push(
          `${factor}x ${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`
        );
      } else if (factor === 0) {
        immune.push(`${typeName.charAt(0).toUpperCase() + typeName.slice(1)}`);
      }
    });

    return { normal, weak, immune, resistant };
  };

  const displayWeaknesses = pokedex.map((poke) => (
    <List.Item
      key={poke.id}
      id={String(poke.id)}
      title={poke.name}
      accessories={poke.types.map((type) => ({
        icon: `types/${type.toLowerCase()}.svg`,
        tooltip: type,
      }))}
      detail={
        loading ? (
          ""
        ) : (
          <List.Item.Detail
            markdown={json2md([
              {
                p: `<img src="https://assets.pokemon.com/assets/cms2/img/pokedex/detail/${String(pokemon?.id).padStart(3, "0")}.png" height="200">`,
              },
            ])}
            metadata={
              <List.Item.Detail.Metadata>
                {effectiveness.weak.length > 0 && (
                  <List.Item.Detail.Metadata.TagList title="Weak to">
                    {effectiveness.weak.map((weakness, index) => (
                      <List.Item.Detail.Metadata.TagList.Item
                        key={index}
                        text={weakness}
                        color={typeColor[weakness.split(" ")[1].toLowerCase()]}
                      />
                    ))}
                  </List.Item.Detail.Metadata.TagList>
                )}
                {effectiveness.resistant.length > 0 && (
                  <List.Item.Detail.Metadata.TagList title="Resistant to">
                    {effectiveness.resistant.map((resistance, index) => (
                      <List.Item.Detail.Metadata.TagList.Item
                        key={index}
                        text={resistance}
                        color={
                          typeColor[resistance.split(" ")[1].toLowerCase()]
                        }
                      />
                    ))}
                  </List.Item.Detail.Metadata.TagList>
                )}
                {effectiveness.immune.length > 0 && (
                  <List.Item.Detail.Metadata.TagList title="Immune to">
                    {effectiveness.immune.map((immunity, index) => (
                      <List.Item.Detail.Metadata.TagList.Item
                        key={index}
                        text={immunity}
                        color={typeColor[immunity.toLowerCase()]}
                      />
                    ))}
                  </List.Item.Detail.Metadata.TagList>
                )}
              </List.Item.Detail.Metadata>
            }
          />
        )
      }
    />
  ));

  const debouncedSelectionChange = useCallback(
    debounce((index: string | null) => {
      if (index) {
        setSelectedPokemonId(parseInt(index));
      }
    }, 300),
    []
  );

  const onSelectionChange = (index: string | null) => {
    setLoading(true);
    debouncedSelectionChange(index);
  };

  return (
    <List
      throttle
      searchBarPlaceholder="Search for a Pokemon"
      navigationTitle={`${loading ? "" : pokemonName + " | "}Weaknesses`}
      isShowingDetail={true}
      isLoading={loading}
      selectedItemId={String(selectedPokemonId)}
      onSelectionChange={onSelectionChange}
      children={displayWeaknesses}
    />
  );
}
