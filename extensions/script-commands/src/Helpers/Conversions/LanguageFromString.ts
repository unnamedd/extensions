import { languageDisplayName } from "@helpers"
import { Language } from "@models"
import { languageURL } from "@urls"

type LanguageFromString = (name: string) => Language

export const languageFromString: LanguageFromString = name => {
  const displayName = languageDisplayName(name)
  const icon = languageURL(name)

  return {
    displayName: displayName,
    name: name,
    icon: icon,
  }
}
