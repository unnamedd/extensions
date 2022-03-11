import { ReadmeDetail } from "@components"

import { IconConstants, ShortcutConstants } from "@constants"

import { CompactGroup } from "@models"

import { Action } from "@raycast/api"

type Props = {
  group: CompactGroup
}

export function ViewReadmeActionItem({ group }: Props): JSX.Element {
  return (
    <Action.Push
      icon={IconConstants.Readme}
      shortcut={ShortcutConstants.ViewReadme}
      title="View README"
      target={<ReadmeDetail group={group} />}
    />
  )
}
