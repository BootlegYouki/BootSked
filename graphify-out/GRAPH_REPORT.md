# Graph Report - BootSked  (2026-06-07)

## Corpus Check
- 28 files · ~19,380 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 278 nodes · 366 edges · 20 communities (17 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7fc99721`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `useTheme()` - 36 edges
2. `TuiText()` - 14 edges
3. `expo` - 12 edges
4. `expo` - 12 edges
5. `scripts` - 9 edges
6. `android` - 6 edges
7. `TUI Template Native (Expo / React Native)` - 6 edges
8. `android` - 6 edges
9. `MainApp()` - 6 edges
10. `MainApp()` - 5 edges

## Surprising Connections (you probably didn't know these)
- `DayButton()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → src/theme/theme-provider.tsx
- `CategoryButton()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → src/theme/theme-provider.tsx
- `NeobrutalistSlider()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → src/theme/theme-provider.tsx
- `ScheduleCard()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → src/theme/theme-provider.tsx
- `ContextMenuOverlay()` --calls--> `useTheme()`  [EXTRACTED]
  App.tsx → src/theme/theme-provider.tsx

## Communities (20 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (39): CategoryButton(), ContextMenuOverlay(), DayButton(), NeobrutalistSlider(), ScheduleCard(), DayButton(), styles, TuiButton() (+31 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (38): CategoryButtonProps, ContextMenuOverlayProps, DayButtonProps, DAYS_OF_WEEK, getHeaderBgColor(), getHeaderBgColorLight(), getHeaderLabelColor(), MainApp() (+30 more)

### Community 2 - "Community 2"
Cohesion: 0.10
Nodes (21): expo, icon, ios, name, orientation, plugins, slug, splash (+13 more)

### Community 3 - "Community 3"
Cohesion: 0.10
Nodes (21): dependencies, expo, expo-document-picker, expo-file-system, expo-font, @expo-google-fonts/jetbrains-mono, expo-notifications, expo-sharing (+13 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (25): author, devDependencies, eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, prettier (+17 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (30): backgroundColor, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled, versionCode (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (22): 1. Rename the Project, 2. Install Dependencies, 3. Launch Development Server, 📦 Automated iOS Release Pipeline, 🛠 Available Scripts, 🎨 Brutalist Design System (TUI), Core Components (`src/components/`), 🚀 Getting Started (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.20
Nodes (7): appJsonPath, fs, packageJsonPath, path, rootDir, slug, workflowPath

### Community 9 - "Community 9"
Cohesion: 0.20
Nodes (10): backgroundColor, backgroundImage, foregroundImage, monochromeImage, adaptiveIcon, package, permissions, predictiveBackGestureEnabled (+2 more)

### Community 10 - "Community 10"
Cohesion: 0.47
Nodes (4): compilerOptions, strict, exclude, extends

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (6): apps, identifier, name, apps, identifier, name

### Community 18 - "Community 18"
Cohesion: 0.20
Nodes (9): ChartItem, MeterSegment, styles, TuiBarChart(), TuiBarChartProps, TuiProgressMeter(), TuiProgressMeterProps, TuiSegmentedMeter() (+1 more)

### Community 20 - "Community 20"
Cohesion: 0.33
Nodes (5): MONTHS, styles, TuiCalendar(), TuiCalendarProps, WEEKDAYS

## Knowledge Gaps
- **173 isolated node(s):** `name`, `slug`, `version`, `orientation`, `icon` (+168 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `expo` connect `Community 2` to `Community 9`, `Community 5`?**
  _High betweenness centrality (0.034) - this node is a cross-community bridge._
- **Why does `useTheme()` connect `Community 0` to `Community 1`, `Community 18`, `Community 20`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **What connects `name`, `slug`, `version` to the rest of the system?**
  _173 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06938775510204082 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06025369978858351 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09523809523809523 - nodes in this community are weakly interconnected._