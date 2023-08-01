import { Action, ActionPanel } from "@raycast/api"

import { ViewSourceCodeActionItem } from "@components"

import { ScriptCommand } from "@models"

import { ShortcutConstants } from "@constants"

type Props = {
  url: string
  scriptCommand: ScriptCommand
}

export function ViewsActionPanel({ url, scriptCommand }: Props): JSX.Element {
  return (
    <ActionPanel.Section>
      <ViewSourceCodeActionItem scriptCommand={scriptCommand} />
      <Action.OpenInBrowser
        url={url}
        shortcut={ShortcutConstants.ViewSourceCodeInBrowser}
      />
      <Action.CopyToClipboard
        title="Copy Script Command URL"
        content={url}
      />
    </ActionPanel.Section>
  )
}
