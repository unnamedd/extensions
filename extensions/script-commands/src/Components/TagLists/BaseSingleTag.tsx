import { nanoid } from "nanoid"
import { Color, Detail, Image, List } from "@raycast/api"

import { TagElementType } from "@types"

export function BaseSingleTag({
  section,
  text,
  icon,
  color,
  type,
}: {
  section: string
  text: string
  icon: Image.ImageLike | null | undefined
  color: Color.ColorLike | Color.Dynamic
  type: TagElementType
}): JSX.Element {
  if (type === TagElementType.Detail) {
    return (
      <Detail.Metadata.TagList title={section}>
        <Detail.Metadata.TagList.Item text={text} icon={icon} color={color} />
      </Detail.Metadata.TagList>
    )
  }

  return (
    <List.Item.Detail.Metadata.TagList title={section}>
      <List.Item.Detail.Metadata.TagList.Item
        key={nanoid()}
        text={text}
        icon={icon}
        color={color}
      />
    </List.Item.Detail.Metadata.TagList>
  )
}
