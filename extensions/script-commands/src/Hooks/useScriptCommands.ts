import { useState, useEffect } from "react"

import { useDataManager } from "@hooks"

import { CompactGroup, MainCompactGroup } from "@models"

import { Filter, Progress, State } from "@types"

import { PackageToast, StoreToast } from "@components"

import { Toast } from "@raycast/api"

type UseScriptCommandsState = {
  main: MainCompactGroup
}

type UserScriptCommandsProps = {
  placeholder: string
  isLoading: boolean
  hasContent: boolean
  groups: CompactGroup[]
  totalScriptCommands: number
  filter: Filter
  isSidebarEnabled: boolean
}

type UseScriptCommands = () => {
  props: UserScriptCommandsProps
  setFilter: (filter: Filter) => void
  setSelection: (identifier: string | null) => void
  installPackage: (group: CompactGroup) => void
}

export const useScriptCommands: UseScriptCommands = () => {
  let toast: Toast | null

  const { dataManager, filter, setFilter, setCommandToRefresh } =
    useDataManager()

  const [state, setState] = useState<UseScriptCommandsState>({
    main: {
      groups: [],
      totalScriptCommands: 0,
      languages: [],
    },
  })

  const setSelection = async (identifier: string | null) => {
    if (!identifier) {
      return null
    }

    const commandState = dataManager.stateFor(identifier)

    if (
      commandState === State.ChangesDetected ||
      commandState === State.NeedSetup
    ) {
      toast = await StoreToast(commandState, Progress.Finished)
    } else if (toast) {
      toast.hide()
    }
  }

  const installPackage = async (group: CompactGroup) => {
    const result = await dataManager.installPackage(group, process => {
      PackageToast(
        Progress.InProgress,
        group.title,
        `Script Command: ${process.current} of ${process.total}...`,
      )

      if (process.progress == Progress.Finished) {
        setCommandToRefresh(process.identifier)
      }
    })

    PackageToast(result, group.title)

    if (result == Progress.Finished) {
      setCommandToRefresh("")
    }
  }

  useEffect(() => {
    async function fetch() {
      const response = await dataManager.fetchCommands(filter)

      setState({
        main: response,
      })
    }

    fetch()
  }, [filter])

  const isLoading = state.main.groups.length === 0
  const totalScriptCommands = state.main.totalScriptCommands
  const hasContent = totalScriptCommands > 0
  let placeholder = "Loading Script Commands..."

  if (!isLoading) {
    placeholder = `Search by name, or author`
  }

  return {
    props: {
      placeholder: placeholder,
      isLoading: isLoading,
      hasContent: hasContent,
      groups: state.main.groups,
      totalScriptCommands: totalScriptCommands,
      filter: filter,
      isSidebarEnabled: dataManager.isSidebarDetailsEnabled(),
    },
    setFilter,
    setSelection,
    installPackage,
  }
}
