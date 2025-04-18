#!/bin/zsh

SHOULD_POP=0

OUT=$(git stash)
echo $OUT

if [ $OUT = "No local changes to save" ]; then
  SHOULD_POP=1;
fi

git checkout $2
echo "deployed"
# deployctl deploy --project=$1 --entrypoint=src/main.ts --org='Gorkha Rifles' --prod
git checkout main

if [ $SHOULD_POP -eq 0 ]; then
git stash pop;
fi