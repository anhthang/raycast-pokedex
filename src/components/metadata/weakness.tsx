import { Detail, List } from "@raycast/api";
import { PokemonType, Type } from "../../types";
import { calculateEffectiveness } from "../../utils";

export default function WeaknessMetadata(props: {
  type?: string;
  types: PokemonType[];
  allTypes: Type[];
}) {
  const TagListComponent =
    props.type === "detail"
      ? Detail.Metadata.TagList
      : List.Item.Detail.Metadata.TagList;

  const { weak, resistant, immune } = calculateEffectiveness(
    props.types,
    props.allTypes || [],
  );

  const tagList = [];

  if (weak.length) {
    tagList.push(
      <TagListComponent title="Weaknesses" key="weak">
        {weak.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  if (immune.length) {
    tagList.push(
      <TagListComponent title="Immunities" key="immune">
        {immune.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  if (resistant.length) {
    tagList.push(
      <TagListComponent title="Resistances" key="resistant">
        {resistant.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  return tagList;
}
