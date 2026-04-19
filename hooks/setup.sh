#!/bin/zsh

chmod +x hooks/pre-commit
cp hooks/pre-commit .git/hooks

deno add "npm:lodash"
deno add "npm:hono@^4.12.14""
deno add "jsr:@std/assert@^1.0.19"
deno add "jsr:@std/testing@^1.0.11/bdd"

echo "Repo Setup Succesfully ✅"
