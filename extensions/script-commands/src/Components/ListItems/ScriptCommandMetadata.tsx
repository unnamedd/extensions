import { List } from "@raycast/api"

import { nanoid } from "nanoid"

import { CompactGroup, ScriptCommand } from "@models"
import { useScriptCommandMetadata } from "@hooks"
import { infoDisplayForAuthor } from "@helpers"
import { ListItemStateTagList } from "Components/TagLists/StateTagList"
import { ListItemLanguageTagList } from "Components/TagLists/LanguageTagList"

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

  elements.push(<Title key={nanoid()} text={props.path} />)

  // Description
  if (props.description) {
    elements.push(<Separator key={nanoid()} />)
    props.description.forEach(line => {
      elements.push(
        <List.Item.Detail.Metadata.Label key={nanoid()} title={line} />,
      )
    })
  }

  // Authors
  const authors = scriptCommand.authors
  if (authors && authors.length > 0) {
    const hasAuthors = authors.length > 1
    elements.push(<Separator key={nanoid()} />)

    authors.forEach((author, index) => {
      const info = infoDisplayForAuthor(author)

      let title = ""
      if (hasAuthors && index == 0) {
        title = "Authors"
      } else if (!hasAuthors) {
        title = "Author"
      }

      elements.push(
        <List.Item.Detail.Metadata.Label
          key={nanoid()}
          title={title}
          text={info.name}
          icon={info.icon}
        />,
      )
    })
  }

  // Date Information
  elements.push(<Separator key={nanoid()} />)
  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Created"
      text={props.dateInfo.createdAt}
    />,
  )
  elements.push(
    <List.Item.Detail.Metadata.Label
      key={nanoid()}
      title="Last Update"
      text={props.dateInfo.updatedAt}
    />,
  )

  // Relevant Information
  elements.push(<Separator key={nanoid()} />)
  elements.push(
    <ListItemLanguageTagList key={nanoid()} language={props.language} />,
  )

  elements.push(<ListItemStateTagList key={nanoid()} state={props.state} />)

  // Extra Information
  elements.push(<Separator key={nanoid()} />)
  elements.push(
    <BooleanLabel
      key={nanoid()}
      title="Need extra setup?"
      value={props.extraInfo.needSetup}
    />,
  )

  elements.push(
    <BooleanLabel
      key={nanoid()}
      title="Has Arguments?"
      value={props.extraInfo.hasArguments}
    />,
  )

  return (
    <List.Item.Detail
      metadata={<List.Item.Detail.Metadata children={elements} />}
    />
  )
}

function Title({ text }: { text: string }): JSX.Element {
  return <List.Item.Detail.Metadata.Label title={text} />
}

function BooleanLabel({
  title,
  value,
}: {
  title: string
  value: boolean
}): JSX.Element {
  return (
    <List.Item.Detail.Metadata.Label
      title={title}
      text={value ? "Yes" : "No"}
    />
  )
}

function Separator(): JSX.Element {
  return <List.Item.Detail.Metadata.Separator />
}
