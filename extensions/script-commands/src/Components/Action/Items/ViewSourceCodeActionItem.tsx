import { SourceCodeDetail } from "@components"

import { IconConstants, ShortcutConstants } from "@constants"

import { ScriptCommand } from "@models"

import { Action } from "@raycast/api"

type Props = {
  scriptCommand: ScriptCommand
}

export function ViewSourceCodeActionItem({
  scriptCommand,
}: Props): JSX.Element {
  return (
    <Action.Push
      icon={IconConstants.SourceCode}
      shortcut={ShortcutConstants.ViewSourceCode}
      title="View Source Code"
      target={<SourceCodeDetail scriptCommand={scriptCommand} />}
    />
  )
}
