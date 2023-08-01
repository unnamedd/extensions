import {
  constants,
  accessSync,
  existsSync,
  mkdirSync,
  readFileSync,
  writeFileSync,
  watch,
  FSWatcher,
} from "fs"

import { getPreferenceValues } from "@raycast/api"

import { FilterKindConstants } from "@constants"

import {
  descriptionForState,
  stateFromString,
  valueForBasicFilterKind,
} from "@helpers"

import { ScriptCommandManager, Settings } from "@managers"

import {
  CompactGroup,
  Language,
  MainCompactGroup,
  ScriptCommand,
} from "@models"

import { fetchReadme, fetchScriptCommands, fetchSourceCode } from "@network"

import { ContentStore } from "@stores"

import {
  AuthorWidgetStyle,
  Content,
  FileNullable,
  Filter,
  FilterKind,
  FilterObject,
  Process,
  Progress,
  State,
  StateResult,
} from "@types"

export class DataManager {
  private static instance = new DataManager()

  private contentManager: ContentStore
  private scriptCommandManager: ScriptCommandManager
  private settings = new Settings()
  private mainContent: MainCompactGroup

  totalScriptCommands = 0

  static shared(): DataManager {
    return this.instance
  }

  private constructor() {
    this.contentManager = new ContentStore()

    this.scriptCommandManager = new ScriptCommandManager(
      this.contentManager,
      this.settings,
    )

    this.mainContent = {
      groups: [],
      languages: [],
      totalScriptCommands: 0,
    }

    this.setupFolders()
    this.loadDatabase()
  }

  private loadDatabase(): void {
    try {
      accessSync(this.settings.databaseFile, constants.R_OK)

      if (existsSync(this.settings.databaseFile)) {
        const data = readFileSync(this.settings.databaseFile).toString()

        if (data.length > 0) {
          const content: Content = JSON.parse(data)
          this.contentManager.setContent(content)
        }
      }
    } catch (error) {
      this.persist()
    }
  }

  private setupFolders(): void {
    const paths = [
      this.settings.supportPath,
      this.settings.repositoryCommandsFolderPath,
      this.settings.imagesCommandsFolderPath,
    ]

    paths.forEach(path => {
      mkdirSync(path, { recursive: true })
    })
  }

  persist(): void {
    const data = JSON.stringify(this.contentManager.getContent(), null, 2)

    if (data && data.length > 0) {
      writeFileSync(this.settings.databaseFile, data)
    }
  }

  clear(): void {
    this.contentManager.clear()
    this.persist()
  }

  private hashFromFile(path: string): string {
    return this.scriptCommandManager.hashFromFile(path)
  }

  private isCommandDownloaded(identifier: string): boolean {
    const command = this.contentManager.contentFor(identifier)
    return command != null
  }

  private hasCommandChanged(identifier: string): boolean {
    const command = this.contentManager.contentFor(identifier)

    if (!command) {
      return false
    }

    const commandPath = command.files.command.path
    const commandHash = command.sha
    const currentFileHash = this.hashFromFile(commandPath)

    return commandHash != currentFileHash
  }

  private commandNeedsSetup(identifier: string): boolean {
    const command = this.contentManager.contentFor(identifier)

    if (command) {
      return command.needsSetup
    }

    return true
  }

  isSidebarDetailsEnabled(): boolean {
    return getPreferenceValues().showSidebarDetails
  }

  authorWidgetStyle(): AuthorWidgetStyle {
    const widgetValue = getPreferenceValues().authorsListItemWidget

    if (typeof widgetValue === "string") {
      if (widgetValue === "only-name") {
        return AuthorWidgetStyle.OnlyName
      } else if (widgetValue === "only-avatar") {
        return AuthorWidgetStyle.OnlyAvatar
      } else if (widgetValue === "avatar-and-name") {
        return AuthorWidgetStyle.AvatarAndName
      }
    }

    return AuthorWidgetStyle.AvatarAndName
  }

  monitorChangesFor(
    identifier: string,
    callback: (state: State) => void,
  ): FSWatcher | null {
    const file = this.commandFileFor(identifier)
    const state = this.stateFor(identifier)

    if (file && state === State.NeedSetup) {
      return watch(file.path, event => {
        if (!this.hasCommandChanged(identifier)) {
          callback(State.NeedSetup)
          return
        }

        if (event == "change") {
          callback(this.stateFor(identifier))
        }
      })
    }

    return null
  }

  updateHashOnChangeFor(
    identifier: string,
    onChange: () => void,
  ): FSWatcher | null {
    const file = this.commandFileFor(identifier)
    const state = this.stateFor(identifier)

    if (file && state == State.Installed) {
      return watch(file.path, event => {
        if (event === "change" && this.hasCommandChanged(identifier)) {
          this.scriptCommandManager.updateHashFor(identifier)
          this.persist()

          onChange()
        }
      })
    }

    return null
  }

  commandFileFor(identifier: string): FileNullable {
    const command = this.contentManager.contentFor(identifier)

    if (!command) {
      return null
    }

    return command.files.command
  }

  stateFor(identifier: string): State {
    const downloaded = this.isCommandDownloaded(identifier)
    const needSetup = this.commandNeedsSetup(identifier)
    const changedContent = this.hasCommandChanged(identifier)

    let state: State = State.NotInstalled

    if (downloaded) {
      state = State.Installed

      if (changedContent && needSetup) {
        state = State.ChangesDetected
      } else if (needSetup) {
        state = State.NeedSetup
      }
    }

    return state
  }

  private buildFilterObject(value: string): FilterObject {
    const dictionary = this.keyPairValuesFrom(value)

    const object: FilterObject = {
      kind: FilterKind.Basic,
      value: dictionary.value,
    }

    if (dictionary.key === FilterKindConstants.Category) {
      object.kind = FilterKind.Category
    } else if (dictionary.key === FilterKindConstants.Language) {
      object.kind = FilterKind.Language
    } else if (dictionary.key === FilterKindConstants.Status) {
      object.kind = FilterKind.Status
    }

    return object
  }

  private keyPairValuesFrom(content: string): { key: string; value: string } {
    if (!content.includes("|")) {
      content = valueForBasicFilterKind
    }

    const index = content.indexOf("|")

    const key = content.substring(0, index)
    const value = content.substring(index + 1, content.length)

    return {
      key: key,
      value: value,
    }
  }

  hasNeedSetupCommands(): boolean {
    const content = this.contentManager.getContent()
    let total = 0

    Object.values(content).forEach(item => {
      if (item.needsSetup === true) {
        total += 1
      }
    })

    return total > 0
  }

  hasInstalledCommands(): boolean {
    const content = this.contentManager.getContent()
    return Object.values(content).length > 0
  }

  fecthCategories(): CompactGroup[] {
    const preference: string = getPreferenceValues().filterDropdownList

    if (preference === "show-subcategories") {
      return this.mainContent.groups
    }

    return this.mainContent.parentGroups ?? []
  }

  fetchLanguages(): Language[] {
    return this.mainContent.languages.sort((left: Language, right: Language) =>
      left.name > right.name ? 1 : -1,
    )
  }

  fetchLanguage(name: string): Language | undefined {
    return this.fetchLanguages().find(item => item.name === name)
  }

  fetchCategory(path: string): CompactGroup | undefined {
    return this.mainContent.parentGroups?.find(item => item.path === path)
  }

  async fetchCommands(filter: Filter = null): Promise<MainCompactGroup> {
    if (filter != null) {
      return this.filterCommands(filter)
    }

    if (this.mainContent.groups.length > 0) {
      return this.mainContent
    }

    this.mainContent = await fetchScriptCommands()
    this.totalScriptCommands = this.mainContent.totalScriptCommands

    return this.mainContent
  }

  private filterCommands(filter: Filter): MainCompactGroup {
    let data = { ...this.mainContent }
    data.totalScriptCommands = 0

    if (filter == null) {
      return data
    }

    const filterObject = this.buildFilterObject(filter)

    if (filterObject.kind == FilterKind.Category) {
      const groups: CompactGroup[] = []

      data.groups.forEach(group => {
        const groupCopy = { ...group }

        if (
          (groupCopy.parentPath &&
            groupCopy.parentPath === filterObject.value) ||
          groupCopy.path === filterObject.value
        ) {
          groups.push(groupCopy)
          data.totalScriptCommands += groupCopy.scriptCommands.length
        }
      })

      data.groups = groups
    } else if (filterObject.kind == FilterKind.Language) {
      const groups: CompactGroup[] = []

      data.groups.forEach(group => {
        const groupCopy = { ...group }
        groupCopy.scriptCommands = []

        group.scriptCommands.forEach(scriptCommand => {
          if (scriptCommand.language == filterObject.value) {
            groupCopy.scriptCommands.push(scriptCommand)
          }
        })

        if (groupCopy.scriptCommands.length > 0) {
          groupCopy.scriptCommands.sort(
            (left: ScriptCommand, right: ScriptCommand) =>
              left.title > right.title ? 1 : -1,
          )

          data.totalScriptCommands += groupCopy.scriptCommands.length
          groups.push(groupCopy)
        }
      })

      groups.sort((left: CompactGroup, right: CompactGroup) =>
        left.title > right.title ? 1 : -1,
      )

      data.groups = groups
    } else if (filterObject.kind == FilterKind.Status) {
      const content = this.contentManager.getContent()
      const state = stateFromString(filterObject.value)

      const group: CompactGroup = {
        identifier: "installed-script-commands",
        path: "installed",
        title: descriptionForState(state),
        subtitle: "Script Commands",
        scriptCommands: [],
      }

      Object.values(content).forEach(item => {
        if (
          (state === State.NeedSetup && item.needsSetup === true) ||
          state === State.Installed
        ) {
          group.scriptCommands.push(item.scriptCommand)
        }
      })

      group.scriptCommands.sort((left: ScriptCommand, right: ScriptCommand) => {
        if (left.packageName && right.packageName) {
          return left.packageName > right.packageName ? 1 : -1
        }

        return 0
      })

      data = {
        groups: [group],
        totalScriptCommands: group.scriptCommands.length,
        languages: [],
      }
    }

    return data
  }

  async fetchSourceCode(
    scriptCommand: ScriptCommand,
    signal: AbortSignal,
  ): Promise<string> {
    return fetchSourceCode(scriptCommand, signal)
  }

  async fetchReadme(path: string, signal: AbortSignal): Promise<string> {
    return fetchReadme(path, signal)
  }

  async installScriptCommand(
    scriptCommand: ScriptCommand,
  ): Promise<StateResult> {
    const result = await this.scriptCommandManager.install(scriptCommand)

    if (
      result.content === State.Installed ||
      result.content === State.NeedSetup
    ) {
      this.persist()
    }

    return result
  }

  async installPackage(
    group: CompactGroup,
    callback: (process: Process) => void,
  ): Promise<Progress> {
    let progress = Progress.InProgress
    let currentInstall = 1

    const scriptCommands: ScriptCommand[] = []

    group.scriptCommands.forEach(scriptCommand => {
      const state = this.stateFor(scriptCommand.identifier)

      if (state == State.NotInstalled) {
        scriptCommands.push(scriptCommand)
      }
    })

    await asyncForLoop(scriptCommands, async scriptCommand => {
      let process: Process = {
        identifier: scriptCommand.identifier,
        progress: Progress.InProgress,
        current: currentInstall,
        state: State.NotInstalled,
        total: scriptCommands.length,
      }

      callback(process)

      const result = await this.installScriptCommand(scriptCommand)

      process = {
        ...process,
        state: result.content,
        progress: Progress.Finished,
      }

      callback(process)

      if (currentInstall == process.total) {
        progress = process.progress
      }

      currentInstall += 1
    })

    return progress
  }

  async deleteScriptCommand(
    scriptCommand: ScriptCommand,
  ): Promise<StateResult> {
    const result = await this.scriptCommandManager.delete(scriptCommand)

    if (result.content === State.NotInstalled) {
      this.persist()
    }

    return result
  }

  async confirmScriptCommandSetupFor(
    scriptCommand: ScriptCommand,
  ): Promise<StateResult> {
    const result = this.scriptCommandManager.finishSetup(scriptCommand)

    if (result.content === State.Installed) {
      this.persist()
    }

    return result
  }
}

type AsyncForLoop<T> = (
  items: T[],
  callback: (item: T) => Promise<void>,
) => Promise<void>

type AsyncLoopCommand = AsyncForLoop<ScriptCommand>

const asyncForLoop: AsyncLoopCommand = async (items, callback) => {
  for (const scriptCommand of items) {
    await callback(scriptCommand)
  }
}
