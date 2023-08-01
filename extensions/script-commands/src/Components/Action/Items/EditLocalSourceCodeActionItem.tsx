import { Action } from "@raycast/api"

import { IconConstants } from "@constants"

type Props = {
  path: string
  onSetup: () => void
}

export function EditLocalSourceCodeActionItem({
  path,
  onSetup,
}: Props): JSX.Element {
  return (
    <Action.OpenWith
      icon={IconConstants.LocalSourceCode}
      title="Edit Local Source Code With"
      path={path}
      onOpen={onSetup}
    />
  )
}
