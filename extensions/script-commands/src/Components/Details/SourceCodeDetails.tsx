import { Action, ActionPanel, Detail } from "@raycast/api"

import { DetailLanguageTagList, DetailStateTagList } from "@components"
import { useSourceCode } from "@hooks"
import { ScriptCommand } from "@models"

type Props = {
  scriptCommand: ScriptCommand
}

export function SourceCodeDetails({ scriptCommand }: Props): JSX.Element {
  const {
    title,
    filename,
    createdAt,
    updatedAt,
    state,
    language,
    isLoading,
    sourceCode,
    sourceCodeURL,
  } = useSourceCode(scriptCommand)

  return (
    <Detail
      navigationTitle={title}
      isLoading={isLoading}
      markdown={sourceCode}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label title="File" text={filename} />
          <Detail.Metadata.Separator />
          <Detail.Metadata.Label title="Created" text={createdAt} />
          <Detail.Metadata.Label title="Last Update" text={updatedAt} />
          <Detail.Metadata.Separator />
          <DetailLanguageTagList language={language} />
          <DetailStateTagList state={state} />
        </Detail.Metadata>
      }
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
