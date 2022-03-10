import { List } from "@raycast/api";

const types = [
  "Normal",
  "Fighting",
  "Flying",
  "Poison",
  "Psychic",
  "Ground",
  "Rock",
  "Bug",
  "Ghost",
  "Steel",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Dragon",
  "Dark",
  "Fairy",
];

export default function TypeDropdown(props: {
  onSelectType: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <List.Dropdown tooltip="Select Pokémon type" onChange={props.onSelectType}>
      <List.Dropdown.Item
        key="all"
        value="all"
        title="All Pokémon types"
        icon="icon.png"
      />
      {types.map((type) => {
        return (
          <List.Dropdown.Item
            key={type}
            value={type}
            title={type}
            icon={`types/${type}.png`}
          />
        );
      })}
    </List.Dropdown>
  );
}
