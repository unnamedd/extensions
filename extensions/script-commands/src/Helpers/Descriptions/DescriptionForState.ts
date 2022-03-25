import { State } from "@types"

type DescriptionForState = (state: State) => string

export const descriptionForState: DescriptionForState = state => {
  let description = ""

  if (state === State.Installed) {
    description = "Installed"
  } else if (state === State.NeedSetup) {
    description = "Need Setup"
  } else if (state === State.ChangesDetected) {
    description = "Changes Detected"
  } else {
    description = "Not installed"
  }

  return description
}
