import { Color } from "@raycast/api"

// The colors used here was borrowed from GitHub Linguistic repository,
// which are already known by developers in GitHub.
// https://github.com/github/linguist/blob/master/lib/linguist/languages.yml

// In order to use the right color for each programming language without hurt
// any eyes when visible in Raycast, some of them received a small change to
// make it lighter or darker. To do so, the website
// https://pinetools.com/lighten-color was used to help in the task.

// Color for Programming Languages used in Script Commands
const colors: { [name: string]: Color.Dynamic } = {
  applescript: { dark: "#4f9999", light: "#101F1F", adjustContrast: true },
  bash: { dark: "#89e051", light: "#89e051", adjustContrast: true },
  node: { dark: "#f1e05a", light: "#f1e05a", adjustContrast: true },
  python: { dark: "#7aabd4", light: "#3572A5", adjustContrast: true },
  ruby: { dark: "#db4042", light: "#701516", adjustContrast: true },
  swift: { dark: "#F05138", light: "#F05138", adjustContrast: true },
}

export const languageColor = (name: string): Color.Dynamic => colors[name]
