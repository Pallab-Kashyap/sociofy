#!/bin/bash

declare -A commits=(
["2024-11-05 10:00:00"]="chore: initialize Next.js app structure"
["2024-11-06 15:30:00"]="feat: setup environment, packages, and config"
["2024-11-08 11:15:00"]="feat: configure database and authentication"
["2024-11-10 09:45:00"]="feat: implement user profiles and UI layout"
["2024-11-12 13:20:00"]="feat: add post creation with uploads"
["2024-11-14 17:10:00"]="feat: add likes and comments system"
["2024-11-18 10:50:00"]="feat: add follow system and explore feed"
["2024-11-20 08:25:00"]="fix: routing and async handler bugs"
["2024-11-22 18:40:00"]="refactor: improve structure and optimize components"
["2024-11-24 14:00:00"]="chore: UI polish, cleanup and final touches"
)

git checkout --orphan new-main
git rm -rf .

git checkout main -- .

for DATE in "${!commits[@]}"; do
  MESSAGE=${commits[$DATE]}

  git add .
  GIT_AUTHOR_DATE="$DATE" \
  GIT_COMMITTER_DATE="$DATE" \
  git commit -m "$MESSAGE"

  # Simulate development by resetting but keeping files
  git reset --soft HEAD~1
  git add .
  GIT_AUTHOR_DATE="$DATE" \
  GIT_COMMITTER_DATE="$DATE" \
  git commit -m "$MESSAGE"
done

git branch -M main
