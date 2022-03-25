import { Action } from "@raycast/api"

import { Author } from "@models"

import { infoDisplayForAuthor } from "@helpers"

type Props = {
  author: Author
}

export function AuthorActionItem({ author }: Props): JSX.Element {
  const info = infoDisplayForAuthor(author)

  if (info.url) {
    return (
      <Action.OpenInBrowser title={info.name} icon={info.icon} url={info.url} />
    )
  }

  return <Action title={info.name} icon={info.icon} />
}
