#!/bin/zsh

chmod +x hooks/pre-commit
cp hooks/pre-commit .git/hooks

deno add "npm:lodash"
deno add "npm:hono@^4.7.7"
deno add "jsr:@std/assert@^1.0.12"
deno add "jsr:@std/testing@^1.0.11/bdd"

echo "Repo Setup Succesfully ✅"
