import { Action } from "@raycast/api"

import { IconConstants } from "@constants"

type Props = {
  onInstallPackage: () => void
}

export function InstallPackageActionItem({
  onInstallPackage,
}: Props): JSX.Element {
  return (
    <Action
      icon={IconConstants.InstallPackage}
      title="Install Package"
      onAction={onInstallPackage}
    />
  )
}
