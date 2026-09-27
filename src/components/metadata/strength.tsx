import { Detail, List } from "@raycast/api";
import { PokemonType, Type } from "../../types";
import { calculateStrengths } from "../../utils";

export default function StrengthMetadata(props: {
  type?: string;
  types: PokemonType[];
  allTypes: Type[];
}) {
  const TagListComponent =
    props.type === "detail"
      ? Detail.Metadata.TagList
      : List.Item.Detail.Metadata.TagList;

  const { superEffective, notVeryEffective, noEffect } = calculateStrengths(
    props.types,
    props.allTypes,
  );

  const tagList = [];

  if (superEffective.length) {
    tagList.push(
      <TagListComponent title="Super Effective" key="super-effective">
        {superEffective.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  if (noEffect.length) {
    tagList.push(
      <TagListComponent title="No Effect" key="no-effect">
        {noEffect.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  if (notVeryEffective.length) {
    tagList.push(
      <TagListComponent title="Not Very Effective" key="not-very-effective">
        {notVeryEffective.map((props, index) => (
          <TagListComponent.Item key={index} {...props} />
        ))}
      </TagListComponent>,
    );
  }

  return tagList;
}
