import { Action } from "@raycast/api"

import { IconConstants } from "@constants"

type Props = {
  path: string
  onSetup: () => void
}

export function SetupActionItem({ path, onSetup }: Props): JSX.Element {
  return (
    <Action.OpenWith
      icon={IconConstants.Setup}
      title="Configure Script Command With"
      path={path}
      onOpen={onSetup}
    />
  )
}
