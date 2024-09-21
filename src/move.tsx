import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import json2md from "json2md";
import debounce from "lodash.debounce";
import groupBy from "lodash.groupby";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMove } from "./api";
import Descriptions from "./components/description";
import TypeDropdown from "./components/type_dropdown";
import moves from "./statics/moves.json";
import { PokemonV2Move } from "./types";
import { typeColor } from "./utils";

const { language } = getPreferenceValues();

export default function PokeMoves() {
  const [move, setMove] = useState<PokemonV2Move | undefined>(undefined);
  const [type, setType] = useState<string>("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMoveId, setSelectedMoveId] = useState<number>(71);

  useEffect(() => {
    setLoading(true);
    fetchMove(selectedMoveId, parseInt(language))
      .then((data) => {
        setMove(data);
      })
      .catch(() => {
        setMove(undefined);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedMoveId]);

  const debouncedSelectionChange = useCallback(
    debounce((index: string | null) => {
      if (index) {
        setSelectedMoveId(parseInt(index));
        if (move) {
          setMove(undefined);
        }
      }
    }, 300),
    [],
  );

  const onSelectionChange = (index: string | null) => {
    debouncedSelectionChange(index);
  };

  const generations = useMemo(() => {
    const listing =
      type === "all" ? moves : moves.filter((m) => m.type === type);

    return groupBy(listing, "generation");
  }, [type]);

  return (
    <List
      throttle
      isShowingDetail={true}
      searchBarAccessory={
        <TypeDropdown command="Move" onSelectType={setType} />
      }
      selectedItemId={String(selectedMoveId)}
      onSelectionChange={onSelectionChange}
      isLoading={loading}
    >
      {Object.entries(generations).map(([generation, moves]) => {
        return (
          <List.Section key={generation} title={generation}>
            {moves.map((m) => {
              return (
                <List.Item
                  key={m.id}
                  id={m.id.toString()}
                  title={m.name}
                  icon={`moves/${m.damage_class || "status"}.svg`}
                  keywords={[m.name]}
                  detail={
                    loading ? (
                      ""
                    ) : (
                      <List.Item.Detail
                        markdown={json2md([
                          {
                            h1: m.name,
                          },
                          {
                            p:
                              move?.pokemon_v2_moveeffect?.pokemon_v2_moveeffecteffecttexts[0].short_effect.replace(
                                "$effect_chance",
                                String(move.move_effect_chance),
                              ) || "",
                          },
                        ])}
                        metadata={
                          <List.Item.Detail.Metadata>
                            <List.Item.Detail.Metadata.TagList title="Type">
                              <List.Item.Detail.Metadata.TagList.Item
                                text={
                                  move?.pokemon_v2_type.pokemon_v2_typenames[0]
                                    .name
                                }
                                icon={`types/${m.type.toLowerCase()}.svg`}
                                color={typeColor[m.type.toLowerCase()]}
                              />
                            </List.Item.Detail.Metadata.TagList>
                            <List.Item.Detail.Metadata.Label
                              title="Category"
                              text={
                                m.damage_class.charAt(0).toUpperCase() +
                                m.damage_class.slice(1)
                              }
                              icon={`moves/${m.damage_class || "status"}.svg`}
                            />
                            <List.Item.Detail.Metadata.Label
                              title="Power"
                              text={move?.power?.toString() || "-"}
                            />
                            <List.Item.Detail.Metadata.Label
                              title="Accuracy"
                              text={move?.accuracy ? move?.accuracy + "%" : "-"}
                            />
                            <List.Item.Detail.Metadata.Label
                              title="PP"
                              text={move?.pp?.toString() || "-"}
                            />
                          </List.Item.Detail.Metadata>
                        }
                      />
                    )
                  }
                  actions={
                    <ActionPanel>
                      <ActionPanel.Section title="Information">
                        <Action.Push
                          title="Descriptions"
                          target={
                            <Descriptions
                              name={m.name}
                              entries={move?.pokemon_v2_moveflavortexts || []}
                            />
                          }
                        />
                      </ActionPanel.Section>
                    </ActionPanel>
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
