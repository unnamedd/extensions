import { nanoid } from "nanoid"

import { BaseSingleTag } from "@components"
import { colorForState, descriptionForState, iconForState } from "@helpers"
import { State, TagElementType } from "@types"

export function ListItemStateTagList({ state }: { state: State }): JSX.Element {
  return <StateTagList state={state} type={TagElementType.List} />
}

export function DetailStateTagList({ state }: { state: State }): JSX.Element {
  return <StateTagList state={state} type={TagElementType.Detail} />
}

function StateTagList({
  state,
  type,
}: {
  state: State
  type: TagElementType
}): JSX.Element {
  const color = colorForState(state)
  const description = descriptionForState(state)
  const icon = iconForState(state)

  return (
    <BaseSingleTag
      key={nanoid()}
      section="Status"
      text={description}
      icon={icon}
      color={color}
      type={type}
    />
  )
}
