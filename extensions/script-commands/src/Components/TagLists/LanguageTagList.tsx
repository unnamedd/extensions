import { nanoid } from "nanoid"

import { BaseSingleTag } from "@components"
import { languageColor } from "@constants"
import { languageFromString } from "@helpers"
import { TagElementType } from "@types"

export function ListItemLanguageTagList({
  language,
}: {
  language: string
}): JSX.Element {
  return <LanguageTagList name={language} type={TagElementType.List} />
}

export function DetailLanguageTagList({
  language,
}: {
  language: string
}): JSX.Element {
  return <LanguageTagList name={language} type={TagElementType.Detail} />
}

function LanguageTagList({
  name,
  type,
}: {
  name: string
  type: TagElementType
}): JSX.Element {
  const language = languageFromString(name)
  const color = languageColor(name)

  return (
    <BaseSingleTag
      key={nanoid()}
      section="Language"
      text={language.displayName}
      icon={language.icon}
      color={color}
      type={type}
    />
  )
}
