import { Color } from "@raycast/api"

import { State } from "@types"

type ColorForState = (state: State) => Color.ColorLike

export const colorForState: ColorForState = state => {
  let color: Color.ColorLike

  if (state === State.Installed) {
    color = Color.Green
  } else if (state === State.NeedSetup) {
    color = Color.Orange
  } else if (state === State.ChangesDetected) {
    color = Color.Orange
  } else {
    color = { dark: "#CCC", light: "#888", adjustContrast: true }
  }

  return color
}
