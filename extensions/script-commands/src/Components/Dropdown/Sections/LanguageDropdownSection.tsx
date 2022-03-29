import { nanoid } from "nanoid"
import { List } from "@raycast/api"

import { TextConstants } from "@constants"
import { valueForFilterKind } from "@helpers"
import { Language } from "@models"
import { languageURL } from "@urls"
import { FilterKind } from "@types"

type Props = {
  languages: Language[]
}

export function LanguageDropdownSection({ languages }: Props): JSX.Element {
  return (
    <List.Dropdown.Section title={TextConstants.Filter.Languages}>
      {languages.map(language => (
        <List.Dropdown.Item
          key={nanoid()}
          title={language.displayName}
          value={valueForFilterKind(FilterKind.Language, language.name)}
          icon={languageURL(language.name)}
        />
      ))}
    </List.Dropdown.Section>
  )
}
