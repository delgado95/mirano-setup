/*
 * ILUSTRAÇÕES DOS TEMAS
 * Desenhos em traço (SVG, quadro de 120x120) usados nas capas dos pacotes.
 * A chave é o "id" do pacote em pacotes.js. Para um pacote novo, adicione uma chave com o mesmo id.
 * Sem ilustração cadastrada, a capa aparece só com o nome.
 */
var ILUSTRACOES = {
  // Joelho: fêmur, patela, tíbia e fíbula
  "joelho":
    '<path d="M52 6 L50 46 M68 6 L70 46"/>' +
    '<path d="M50 46 C38 48 37 62 48 64 C54 65 57 62 60 59 C63 62 66 65 72 64 C83 62 82 48 70 46"/>' +
    '<ellipse cx="60" cy="55" rx="7" ry="9" fill="currentColor" fill-opacity=".18"/>' +
    '<path d="M44 72 L76 72 M44 72 C42 77 46 81 52 82 L54 116 M76 72 C78 77 74 81 70 82 L68 116"/>' +
    '<path d="M80 84 L78 116"/>' +
    '<path d="M36 68 L84 68" stroke-dasharray="2 5" stroke-opacity=".6"/>',

  // Ombro: clavícula, acrômio, cabeça do úmero e escápula
  "ombro":
    '<path d="M38 26 C58 18 88 22 112 15"/>' +
    '<path d="M40 27 C55 28 68 30 76 35"/>' +
    '<circle cx="60" cy="52" r="15"/>' +
    '<path d="M50 63 L53 116 M70 63 L66 116"/>' +
    '<path d="M38 32 C31 46 31 59 39 72 M38 32 L14 42 M39 72 L20 110"/>' +
    '<circle cx="60" cy="52" r="22" stroke-dasharray="2 5" stroke-opacity=".6"/>',

  // Punho e mão: contorno da mão e ossos do carpo
  "punho-e-mao":
    '<path d="M40 116 L40 86 C36 78 30 68 26 60 C23 53 30 48 35 55 L44 68 L44 32 C44 25 52 25 52 32 L52 60 L52 22 C52 15 60 15 60 22 L60 60 L60 26 C60 19 68 19 68 26 L68 62 L68 36 C68 29 76 29 76 36 L76 80 C76 92 72 100 72 116"/>' +
    '<circle cx="50" cy="94" r="3.5"/><circle cx="58" cy="91" r="3.5"/><circle cx="66" cy="94" r="3.5"/>' +
    '<path d="M38 104 L74 104" stroke-dasharray="2 5" stroke-opacity=".6"/>',

  // Pele: camadas, folículo com pelo e sol
  "pele":
    '<path d="M8 50 C24 44 38 56 54 50 C70 44 86 56 112 50"/>' +
    '<path d="M8 60 C24 54 38 66 54 60 C70 54 86 66 112 60" stroke-opacity=".6"/>' +
    '<path d="M8 92 L112 92" stroke-dasharray="2 5" stroke-opacity=".6"/>' +
    '<path d="M64 88 C61 70 60 50 66 26"/>' +
    '<ellipse cx="64" cy="90" rx="5" ry="7" fill="currentColor" fill-opacity=".18"/>' +
    '<circle cx="30" cy="76" r="3"/><circle cx="42" cy="82" r="3"/><circle cx="88" cy="76" r="3"/><circle cx="98" cy="84" r="3"/>' +
    '<circle cx="98" cy="18" r="7"/><path d="M98 4 L98 7 M98 29 L98 32 M84 18 L87 18 M109 18 L112 18 M88 8 L90 10 M106 26 L108 28 M108 8 L106 10 M90 26 L88 28"/>',

  // Cabelo: couro cabeludo, folículos e fios
  "cabelo":
    '<path d="M8 82 C40 75 80 75 112 82"/>' +
    '<path d="M30 80 C27 54 36 32 30 8 M50 78 C49 52 58 34 54 10 M70 78 C72 54 80 36 76 12 M90 80 C92 58 99 42 96 18"/>' +
    '<ellipse cx="30" cy="94" rx="4" ry="6" fill="currentColor" fill-opacity=".18"/><ellipse cx="50" cy="92" rx="4" ry="6" fill="currentColor" fill-opacity=".18"/>' +
    '<ellipse cx="70" cy="92" rx="4" ry="6" fill="currentColor" fill-opacity=".18"/><ellipse cx="90" cy="94" rx="4" ry="6" fill="currentColor" fill-opacity=".18"/>' +
    '<path d="M8 104 L112 104" stroke-dasharray="2 5" stroke-opacity=".6"/>',

  // Pressão alta: coração e traçado de eletrocardiograma
  "pressao-alta":
    '<path d="M60 102 C32 84 16 68 16 48 C16 32 27 22 41 22 C50 22 56 27 60 34 C64 27 70 22 79 22 C93 22 104 32 104 48 C104 68 88 84 60 102 Z" stroke-opacity=".7"/>' +
    '<path d="M6 60 L36 60 L43 47 L51 76 L59 34 L67 70 L73 60 L114 60"/>',

  // Gengiva: dente e linha da gengiva
  "gengiva":
    '<path d="M38 32 C38 18 50 15 60 21 C70 15 82 18 82 32 C82 46 78 54 76 60 L72 104 C71 111 64 111 63 104 L60 80 L57 104 C56 111 49 111 48 104 L44 60 C42 54 38 46 38 32 Z"/>' +
    '<path d="M12 68 C28 60 40 72 50 66 C56 62 64 62 70 66 C80 72 92 60 108 68"/>' +
    '<path d="M12 78 C28 70 40 82 50 76 C56 72 64 72 70 76 C80 82 92 70 108 78" stroke-dasharray="2 5" stroke-opacity=".6"/>',

  // Ansiedade: perfil da cabeça com pensamento embaralhado
  "ansiedade":
    '<path d="M72 114 L72 98 C82 98 90 94 90 86 L90 78 L98 74 L90 62 C92 38 78 16 54 16 C32 16 16 32 16 54 C16 70 24 80 32 86 L32 114"/>' +
    '<path d="M32 50 C36 38 46 58 52 46 C58 34 64 60 70 46 C74 38 80 50 76 56 C70 64 44 62 40 54 C36 46 52 36 60 42" stroke-opacity=".85"/>'
};

// Coluna: vértebras empilhadas em leve curva, com os discos entre elas
ILUSTRACOES["coluna"] = (function () {
  var s = "";
  for (var i = 0; i < 7; i++) {
    var y = 6 + i * 15.5;
    var x = 44 + Math.sin(i / 6 * Math.PI * 1.4) * 8;
    s += '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="30" height="10" rx="3.5"/>';
    s += '<path d="M' + (x + 30).toFixed(1) + ' ' + (y + 5).toFixed(1) + ' L' + (x + 40).toFixed(1) + ' ' + (y + 8).toFixed(1) + '"/>';
    if (i < 6) s += '<path d="M' + (x + 6).toFixed(1) + ' ' + (y + 12.8).toFixed(1) + ' L' + (x + 24).toFixed(1) + ' ' + (y + 12.8).toFixed(1) + '" stroke-opacity=".55"/>';
  }
  return s;
})();

function ilustra(id, cls) {
  var d = ILUSTRACOES[id];
  if (!d) return "";
  return '<svg class="' + (cls || "ilu") + '" viewBox="0 0 120 120" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + d + "</svg>";
}

// Preenche qualquer elemento com data-ilu="id"
function aplicaIlustracoes(root) {
  (root || document).querySelectorAll("[data-ilu]").forEach(function (el) {
    el.insertAdjacentHTML("afterbegin", ilustra(el.getAttribute("data-ilu"), "ilu"));
  });
}
