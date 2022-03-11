import { Action, ActionPanel, Detail } from "@raycast/api"

import { ScriptCommand } from "@models"

import { useSourceCode } from "@hooks"

type Props = {
  scriptCommand: ScriptCommand
}

export function SourceCodeDetail({ scriptCommand }: Props): JSX.Element {
  const { title, isLoading, sourceCode, sourceCodeURL } =
    useSourceCode(scriptCommand)

  return (
    <Detail
      navigationTitle={title}
      isLoading={isLoading}
      markdown={sourceCode}
      actions={
        <ActionPanel title={title}>
          <ActionsSection url={sourceCodeURL} />
        </ActionPanel>
      }
    />
  )
}

function ActionsSection({ url }: { url: string }): JSX.Element {
  return (
    <ActionPanel.Section>
      <Action.OpenInBrowser url={url} />
      <Action.CopyToClipboard title="Copy Script Command URL" content={url} />
    </ActionPanel.Section>
  )
}
