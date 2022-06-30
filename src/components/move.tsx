import { useMemo, useState } from "react";
import { List } from "@raycast/api";
import json2md from "json2md";
import groupBy from "lodash.groupby";
import { PokemonV2Pokemonmove } from "../types";

export default function PokemonMoves(props: {
  name: string;
  moves: PokemonV2Pokemonmove[];
}) {
  const groups = props.moves.reduce((out: { [name: string]: string }, cur) => {
    out[cur.pokemon_v2_versiongroup.name] =
      cur.pokemon_v2_versiongroup.pokemon_v2_versions
        .map((v) => v.pokemon_v2_versionnames[0]?.name || v.name)
        .join(" - ");
    return out;
  }, {});

  const [versionGroup, setVersionGroup] = useState<string>();

  const pokemonMoves = useMemo(() => {
    const moves = versionGroup
      ? props.moves.filter(
          (m) => m.pokemon_v2_versiongroup.name === versionGroup
        )
      : props.moves;
    return groupBy(
      moves,
      (m) =>
        m.pokemon_v2_movelearnmethod.pokemon_v2_movelearnmethodnames[0].name
    );
  }, [versionGroup]);

  return (
    <List
      throttle
      navigationTitle={`${props.name} | Moves`}
      isShowingDetail={true}
      searchBarAccessory={
        <List.Dropdown
          tooltip="Change Version Group"
          onChange={setVersionGroup}
        >
          {Object.entries(groups).map(([key, value]) => (
            <List.Dropdown.Item key={key} value={key} title={value} />
          ))}
        </List.Dropdown>
      }
    >
      {Object.entries(pokemonMoves).map(([method, methodMoves]) => {
        return (
          <List.Section title={method} key={method}>
            {methodMoves.map((move) => {
              const machine = move.pokemon_v2_move.pokemon_v2_machines.find(
                (m) => m.version_group_id === move.pokemon_v2_versiongroup.id
              );
              return (
                <List.Item
                  key={`${move.pokemon_v2_versiongroup.name}-${move.move_learn_method_id}-${move.level}-${move.move_id}`}
                  title={move.pokemon_v2_move.pokemon_v2_movenames[0].name}
                  keywords={[move.pokemon_v2_move.pokemon_v2_movenames[0].name]}
                  icon={`moves/${move.pokemon_v2_move.pokemon_v2_movedamageclass.pokemon_v2_movedamageclassnames[0].name}.svg`}
                  accessories={[
                    {
                      text:
                        move.move_learn_method_id === 1
                          ? move.level.toString()
                          : `TM${machine?.machine_number
                              .toString()
                              .padStart(2, "0")}`,
                    },
                    {
                      tooltip:
                        move.pokemon_v2_move.pokemon_v2_type
                          .pokemon_v2_typenames[0].name,
                      icon: `types/${move.pokemon_v2_move.pokemon_v2_type.name}.svg`,
                    },
                  ]}
                  detail={
                    <List.Item.Detail
                      markdown={json2md([
                        {
                          h1: move.pokemon_v2_move.pokemon_v2_movenames[0].name,
                        },
                        {
                          p: move.pokemon_v2_move.pokemon_v2_moveeffect
                            .pokemon_v2_moveeffecteffecttexts[0]
                            ? move.pokemon_v2_move.pokemon_v2_moveeffect.pokemon_v2_moveeffecteffecttexts[0].short_effect.replace(
                                "$effect_chance",
                                move.pokemon_v2_move.move_effect_chance?.toString() ??
                                  ""
                              )
                            : "",
                        },
                      ])}
                      metadata={
                        <List.Item.Detail.Metadata>
                          <List.Item.Detail.Metadata.Label
                            title="Power"
                            text={move.pokemon_v2_move.power?.toString() || "-"}
                          />
                          <List.Item.Detail.Metadata.Label
                            title="Accuracy"
                            text={
                              move.pokemon_v2_move.accuracy
                                ? move.pokemon_v2_move.accuracy + "%"
                                : "-"
                            }
                          />
                          <List.Item.Detail.Metadata.Label
                            title="PP"
                            text={move.pokemon_v2_move.pp?.toString() || "-"}
                          />
                        </List.Item.Detail.Metadata>
                      }
                    />
                  }
                />
              );
            })}
          </List.Section>
        );
      })}
    </List>
  );
}
