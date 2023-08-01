import { IconConstants, ShortcutConstants } from "@constants"

import { Action } from "@raycast/api"

import { Filter } from "@types"

type Props = {
  onFilter: (filter: Filter) => void
}

export function ClearFilterActionItem({ onFilter }: Props): JSX.Element {
  return (
    <Action
      title="Clear Filter"
      icon={IconConstants.ClearFilter}
      shortcut={ShortcutConstants.ClearFilter}
      onAction={() => onFilter(null)}
    />
  )
}
