# Mirano Setup

Site de vendas dos pacotes de vídeos para profissionais de saúde. Cada pacote tem 30 vídeos sobre um tema.

Site publicado: https://delgado95.github.io/mirano-setup/

> Fase de validação. Os pacotes, preços e a tela de pagamento são exemplos. O checkout não processa pagamento.

## Como editar

| Quero mudar | Arquivo |
|---|---|
| Pacotes, preços, exemplos de vídeo, áreas | `pacotes.js` |
| Textos e layout da página inicial | `src/index.html` |
| Desenho de um tema | `ilustracoes.js` |
| Tela de pagamento | `checkout.html` |

Depois de editar, gere o site de novo:

```bash
node build.js
```

Isso recria `index.html`, `pacotes/*.html`, `sitemap.xml`, `robots.txt` e `site.webmanifest`. Não edite esses arquivos à mão.

Para um domínio próprio:

```bash
SITE_URL=https://seudominio.com.br node build.js
```

Se mudar a logo ou a imagem de compartilhamento, refaça os PNGs (precisa do Edge ou Chrome e do Python com Pillow):

```bash
bash ferramentas/gerar-imagens.sh
```

## Publicação

O GitHub Pages publica a branch `main` direto da raiz. Faça commit dos arquivos gerados junto com as suas mudanças.
