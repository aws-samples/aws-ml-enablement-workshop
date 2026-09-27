# CLAUDE.md

@AGENTS.md

## Claude Code 固有の補足

- モックの実装は `.claude/skills/mock-builder/` の skill から始めます。PR/FAQ と Tracker のエンドポイント情報を尋ねたうえで `prompt/prompt.md` に沿って進みます。
- 実装に入る前に plan mode（Shift+Tab で切り替え）で計画を出させると、作り直しが減ります。確定した計画は `construction/plan.md` に残してください。
- ワークの内容は `AGENTS.md` 側で管理しています。このファイルには重複して書かないでください。
