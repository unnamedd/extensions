import { Action, ActionPanel, Detail } from "@raycast/api"

import { Language, ScriptCommand } from "@models"

import { useSourceCode } from "@hooks"
import { languageColor } from "@constants"
import { languageURL } from "@urls"
import { State } from "@types"
import { colorForState, descriptionForState, iconForState } from "@helpers"

type Props = {
  scriptCommand: ScriptCommand
}

export function SourceCodeDetail({ scriptCommand }: Props): JSX.Element {
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
          <Detail.Metadata.Label title="Created at" text={createdAt} />
          <Detail.Metadata.Label title="Updated at" text={updatedAt} />
          <Detail.Metadata.Separator />
          <LanguageTagList language={language} />
          <StateTagList state={state} />
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

function LanguageTagList({ language }: { language: Language }): JSX.Element {
  const name = language.name
  const displayName = language.displayName

  const icon = languageURL(name)
  const color = languageColor(name)

  return (
    <Detail.Metadata.TagList title="Language">
      <Detail.Metadata.TagList.Item
        text={displayName}
        icon={icon}
        color={color}
      />
    </Detail.Metadata.TagList>
  )
}

function StateTagList({ state }: { state: State }): JSX.Element {
  const color = colorForState(state)
  const description = descriptionForState(state)
  const icon = iconForState(state)

  return (
    <Detail.Metadata.TagList title="Status">
      <Detail.Metadata.TagList.Item
        text={description}
        icon={icon}
        color={color}
      />
    </Detail.Metadata.TagList>
  )
}
