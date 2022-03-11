import { nanoid } from "nanoid"

import { ActionPanel } from "@raycast/api"

import { Author } from "@models"

import { AuthorActionItem } from "@components"

type Props = {
  authors: Author[]
}

export function AuthorsActionPanel({ authors }: Props): JSX.Element {
  const count = authors.length
  const suffix = count > 1 ? "s" : ""
  const totalDescription = `Author${suffix}`

  return (
    <ActionPanel.Section
      title={totalDescription}
      children={authors.map(author => (
        <AuthorActionItem key={author.url ?? nanoid()} author={author} />
      ))}
    />
  )
}
