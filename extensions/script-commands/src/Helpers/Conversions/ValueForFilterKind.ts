import { FilterKindConstants } from "@constants"
import { FilterKind } from "@types"

type ValueForFilterKind = (kind: FilterKind, value: string) => string

export const valueForFilterKind: ValueForFilterKind = (kind, value) => {
  let description = ""

  if (kind === FilterKind.Basic) {
    description = `${FilterKindConstants.Basic}|all`
  } else if (kind === FilterKind.Category) {
    description = `${FilterKindConstants.Category}|${value}`
  } else if (kind === FilterKind.Language) {
    description = `${FilterKindConstants.Language}|${value}`
  } else if (kind === FilterKind.Status) {
    description = `${FilterKindConstants.Status}|${value}`
  }

  return description
}

export const valueForBasicFilterKind = valueForFilterKind(FilterKind.Basic, "")
