#!/usr/bin/env bash
# Store the Discord bot settings for the daily fan-art sync in GitHub Actions.
# The token is read without echo, checked with Discord, and handed to `gh` through stdin,
# so it never appears on screen, in shell history or in a process list.
# Run it again any time the token is reset.
set -euo pipefail

REPO="samoyedtopa1120-cmd/topa-homepage"

command -v gh >/dev/null || { echo "需要 GitHub CLI：brew install gh"; exit 1; }
gh auth status >/dev/null 2>&1 || { echo "請先登入 GitHub CLI：gh auth login"; exit 1; }

echo "== Discord bot token =="
echo "到 Discord Developer Portal → 多帕網站同步 → 機器人 → 重設權杖，複製後貼在這裡。"
read -rsp "Token（輸入時不會顯示，按 Enter 結束）：" token
echo
token="${token//[[:space:]]/}"
[[ -n "$token" ]] || { echo "沒有輸入 token，什麼都沒改。"; exit 1; }

# Ask Discord who this token belongs to, so a wrong paste is caught right away.
me="$(printf 'Authorization: Bot %s\n' "$token" | curl -sS -H @- https://discord.com/api/v10/users/@me || true)"
if [[ "$me" != *'"bot": true'* && "$me" != *'"bot":true'* ]]; then
  echo "Discord 不認得這個 token（可能貼錯或已被重設），什麼都沒改。"
  exit 1
fi
name="$(printf '%s' "$me" | python3 -c 'import json, sys; print(json.load(sys.stdin).get("username", "?"))' 2>/dev/null || true)"
echo "✓ Token 有效：bot「${name:-?}」"

printf '%s' "$token" | gh secret set DISCORD_BOT_TOKEN --repo "$REPO"
unset token me
echo "✓ 已存成 GitHub Secret：DISCORD_BOT_TOKEN"

echo
echo "== 頻道與作者（可留空，按 Enter 略過，之後再跑一次這支程式補上）=="
echo "Discord 設定 → 進階 → 開啟「開發者模式」，再對頻道／多帕按右鍵「複製 ID」。"

read -rp "二創頻道 ID：" channel
channel="${channel//[[:space:]]/}"
if [[ -n "$channel" ]]; then
  [[ "$channel" =~ ^[0-9]+$ ]] || { echo "頻道 ID 只能是數字。"; exit 1; }
  gh variable set DISCORD_FANART_CHANNEL_ID --repo "$REPO" --body "$channel"
  echo "✓ DISCORD_FANART_CHANNEL_ID = $channel"
fi

read -rp "多帕的使用者 ID（多位用逗號分隔）：" authors
authors="${authors//[[:space:]]/}"
if [[ -n "$authors" ]]; then
  [[ "$authors" =~ ^[0-9]+(,[0-9]+)*$ ]] || { echo "使用者 ID 只能是數字，多位用逗號分隔。"; exit 1; }
  gh variable set DISCORD_FANART_AUTHOR_IDS --repo "$REPO" --body "$authors"
  echo "✓ DISCORD_FANART_AUTHOR_IDS = $authors"
fi

echo
echo "完成。把 bot 邀進伺服器後，就可以到 Actions 手動跑一次部署確認。"
