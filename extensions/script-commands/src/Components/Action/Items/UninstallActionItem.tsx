import { Action } from "@raycast/api"

import { IconConstants, ShortcutConstants } from "@constants"

type Props = {
  onUninstall: () => void
}

export function UninstallActionItem({ onUninstall }: Props): JSX.Element {
  return (
    <Action
      icon={IconConstants.Uninstall}
      title="Uninstall Script Command"
      shortcut={ShortcutConstants.Uninstall}
      onAction={onUninstall}
    />
  )
}
