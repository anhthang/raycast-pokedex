import { Action, ActionPanel, getPreferenceValues, List } from "@raycast/api";
import json2md from "json2md";
import debounce from "lodash.debounce";
import groupBy from "lodash.groupby";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchMove } from "./api";
import Descriptions from "./components/description";
import MoveMetadata from "./components/metadata/move";
import MoveLearnset from "./components/move_learnset";
import TypeDropdown from "./components/type_dropdown";
import moves from "./statics/moves.json";
import { PokemonV2Move } from "./types";

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
                    loading ? undefined : (
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
                          move ? <MoveMetadata move={move} /> : undefined
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
                        <Action.Push
                          title="Learnset"
                          target={
                            <MoveLearnset
                              moves={move?.pokemon_v2_pokemonmoves || []}
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
