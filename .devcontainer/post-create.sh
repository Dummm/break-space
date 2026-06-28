#!/usr/bin/env bash

set -e

pnpm install

echo ""
echo "Development container ready."
echo ""

pnpm check || true