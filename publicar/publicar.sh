#!/bin/zsh
# Publica o quadro na Vercel. Estrutura esperada:
#   public/<nome-secreto>/   o teu quadro com dados reais (só quem tem o endereço o vê)
#   public/casa/             a versão 3D (opcional)
# Primeira vez: npx vercel login. Depois: ./publicar.sh
set -e
cd "$(dirname "$0")"
npx --yes vercel@latest deploy --prod --yes
