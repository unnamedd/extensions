import { State } from "@types"

import { StateConstants } from "@constants"

type StateFromString = (value: string) => State

export const stateFromString: StateFromString = value => {
  let state: State

  if (value === StateConstants.Installed) {
    state = State.Installed
  } else if (value === StateConstants.NeedSetup) {
    state = State.NeedSetup
  } else if (value === StateConstants.ChangesDetected) {
    state = State.ChangesDetected
  } else if (value === StateConstants.NotInstalled) {
    state = State.NotInstalled
  } else {
    state = State.Error
  }

  return state
}
