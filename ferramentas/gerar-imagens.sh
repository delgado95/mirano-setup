#!/usr/bin/env bash
# Gera as imagens PNG do site:
#   assets/og-image.png          imagem de compartilhamento (1200x630), a partir de ferramentas/og-image.html
#   assets/icon-512.png          ícone, a partir de assets/favicon.svg
#   assets/icon-192.png          ícone menor
#   assets/apple-touch-icon.png  ícone do iPhone (180x180)
#
# Precisa do Microsoft Edge ou Google Chrome e do Python com Pillow (pip install pillow).
# Rode a partir da pasta do projeto:  bash ferramentas/gerar-imagens.sh
#
# Atenção: não redirecione a saída deste script (> arquivo). O Edge falha em silêncio quando a saída é redirecionada.
set -e
cd "$(dirname "$0")/.."
ROOT="$(pwd -W 2>/dev/null || pwd)"

BROWSER=""
for b in "/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" \
         "/c/Program Files/Google/Chrome/Application/chrome.exe" \
         "$(command -v google-chrome || true)" "$(command -v chromium || true)"; do
  if [ -n "$b" ] && [ -x "$b" ]; then BROWSER="$b"; break; fi
done
[ -z "$BROWSER" ] && { echo "Edge ou Chrome não encontrado."; exit 1; }

TMP="$(mktemp -d)"
winpath() { cygpath -w "$1" 2>/dev/null || echo "$1"; }
fileurl() { echo "file:///$(winpath "$1" | sed 's#\\#/#g')"; }

shot() { # largura altura arquivo-de-saida url
  rm -f "$3"
  for tentativa in 1 2 3 4; do
    "$BROWSER" --headless=new --disable-gpu --hide-scrollbars --allow-file-access-from-files \
      --user-data-dir="$(winpath "$TMP/perfil-$tentativa-$RANDOM")" --window-size="$1,$2" \
      --virtual-time-budget=4000 --screenshot="$(winpath "$ROOT/$3")" "$4" || true
    [ -s "$3" ] && return 0
  done
  echo "  falhou  $3"; return 1
}

# Imagem de compartilhamento
shot 1200 630 assets/og-image.png "file:///$ROOT/ferramentas/og-image.html"
echo "  gerado  assets/og-image.png"

# Ícone: renderiza o favicon em 512px numa janela maior, depois recorta e reduz
cat > "$TMP/icone.html" <<HTML
<html><body style="margin:0;overflow:hidden;background:#0C2B3A"><img src="file:///$ROOT/assets/favicon.svg" style="width:512px;height:512px;display:block"></body></html>
HTML
shot 640 640 assets/.icone-bruto.png "$(fileurl "$TMP/icone.html")"

python -c "
from PIL import Image
base = Image.open('assets/.icone-bruto.png').convert('RGB').crop((0, 0, 512, 512))
for n, f in [(512, 'assets/icon-512.png'), (192, 'assets/icon-192.png'), (180, 'assets/apple-touch-icon.png')]:
    (base if n == 512 else base.resize((n, n), Image.LANCZOS)).save(f, optimize=True)
    print('  gerado  ' + f)
"
rm -f assets/.icone-bruto.png
rm -rf "$TMP" 2>/dev/null || true  # o navegador às vezes ainda segura a pasta
