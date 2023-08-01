import { Toast, showToast } from "@raycast/api"

import { Progress } from "@types"

export async function PackageToast(
  progress: Progress,
  packageName = "",
  message = "",
): Promise<Toast> {
  let title = ""
  let style = Toast.Style.Animated

  switch (progress) {
    case Progress.InProgress:
      {
        title = `Installing package '${packageName}'...`
        style = Toast.Style.Animated
      }
      break

    case Progress.Finished:
      {
        title = `Package '${packageName}' installed!`
        style = Toast.Style.Success
      }
      break
  }

  return showToast(style, title, message)
}
