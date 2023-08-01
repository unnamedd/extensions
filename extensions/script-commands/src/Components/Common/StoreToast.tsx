import { showToast, Toast } from "@raycast/api"

import { State, Progress } from "@types"

export async function StoreToast(
  state: State,
  progress: Progress,
  message = "",
): Promise<Toast> {
  let title = ""
  let style = Toast.Style.Animated

  switch (state) {
    case State.Installed:
      {
        if (progress === Progress.InProgress) {
          title = "Uninstalling Script Command..."
          style = Toast.Style.Animated
        } else {
          title = "Script Command uninstalled!"
          style = Toast.Style.Success
        }
      }
      break

    case State.NotInstalled:
      {
        if (progress === Progress.InProgress) {
          title = "Installing Script Command..."
          style = Toast.Style.Animated
        } else {
          title = "Script Command installed!"
          style = Toast.Style.Success
        }
      }
      break

    case State.NeedSetup:
      {
        title = "Extra setup needed!"
        message = "You must edit the Script Command before you can use it"
        style = Toast.Style.Success
      }
      break

    case State.ChangesDetected:
      {
        title = "Changes Detected!"
        message =
          "Press Return to confirm your change and activate the Script Command."
        style = Toast.Style.Success
      }
      break

    case State.Error:
      {
        title = "Error 😔"
        message = "Something went wrong"
        style = Toast.Style.Failure
      }
      break
  }

  return showToast(style, title, message)
}
