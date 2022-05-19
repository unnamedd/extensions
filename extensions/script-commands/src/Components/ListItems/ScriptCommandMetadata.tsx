import { List } from "@raycast/api"

import { nanoid } from "nanoid"

import { CompactGroup, ScriptCommand } from "@models"
import { useScriptCommandMetadata } from "@hooks"
import { infoDisplayForAuthor } from "@helpers"

type Props = {
  scriptCommand: ScriptCommand
  group: CompactGroup
}

export function ScriptCommandMetadata({
  scriptCommand,
  group,
}: Props): JSX.Element {
  const { props } = useScriptCommandMetadata(scriptCommand, group)

  const elements: JSX.Element[] = []

  elements.push(
    <List.Item.Detail.Metadata.Label key={nanoid()} title={props.path} />
  )

  if (props.description) {
    elements.push(
      <List.Item.Detail.Metadata.Label
        key={nanoid()}
        title=""
        text={props.description}
      />
    )
  }

  const authors = scriptCommand.authors
  if (authors && authors.length > 0) {
    const hasAuthors = authors.length > 1
    elements.push(<List.Item.Detail.Metadata.Separator key={nanoid()} />)

    if (hasAuthors) {
      elements.push(
        <List.Item.Detail.Metadata.Label key={nanoid()} title="Authors" />
      )
    }

    authors.forEach(author => {
      const info = infoDisplayForAuthor(author)

      elements.push(
        <List.Item.Detail.Metadata.Label
          key={nanoid()}
          title={hasAuthors ? "" : "Author"}
          text={info.name}
          icon={info.icon}
        />
      )
    })
  }

  elements.push(<List.Item.Detail.Metadata.Separator key={nanoid()} />)
  elements.push(
    <List.Item.Detail.Metadata.Label key={nanoid()} title="Date Information" />
  )
  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Created"
      text={props.dateInfo.createdAt}
    />
  )
  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Last Update"
      text={props.dateInfo.updatedAt}
    />
  )

  elements.push(<List.Item.Detail.Metadata.Separator key={nanoid()} />)
  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Language"
      text={props.language.text}
      icon={props.language.icon}
    />
  )

  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Status"
      text={props.status.text}
      icon={props.status.icon}
    />
  )

  return (
    <List.Item.Detail
      metadata={<List.Item.Detail.Metadata children={elements} />}
    />
  )
}
