import { useDataManager } from "@hooks"

type LanguageDisplayName = (name: string) => string

export const languageDisplayName: LanguageDisplayName = name => {
  const { dataManager } = useDataManager()
  const language = dataManager.fetchLanguage(name)
  let displayName = name

  // Hack to make the first letter uppercased
  displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1)

  if (language) {
    displayName = language.displayName
  }

  return displayName
}
