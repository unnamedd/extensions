import { Action } from "@raycast/api"

import { IconConstants } from "@constants"

type Props = {
  onConfirmSetup: () => void
}

export function ConfirmChangeActionItem({
  onConfirmSetup,
}: Props): JSX.Element {
  return (
    <Action
      icon={IconConstants.ConfirmChange}
      title="Confirm Changes on Script Command"
      onAction={onConfirmSetup}
    />
  )
}
