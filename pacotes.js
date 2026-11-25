/*
 * CATÁLOGO DA MIRANO SETUP
 * Usado pela página de vendas (index.html) e pela tela de pagamento (checkout.html).
 *
 * id    → identificador na URL (checkout.html#joelho). Só letras minúsculas, números e hífen.
 * area  → uma das chaves de AREAS
 * preco → valor em reais
 * link  → link de pagamento externo (Kiwify, Hotmart etc.). Deixe "" para usar o checkout.html.
 */
/*
 * publico → quem atende essa área. Aparece na seção "Para quem é", nas páginas dos pacotes
 *           e nas descrições que o Google mostra. Escreva como as pessoas buscam.
 */
var AREAS = {
  orto:   { nome: "Ortopedia",    publico: "ortopedistas, fisioterapeutas e educadores físicos" },
  derm:   { nome: "Dermatologia", publico: "dermatologistas e profissionais de estética" },
  cardio: { nome: "Cardiologia",  publico: "cardiologistas e clínicos gerais" },
  odonto: { nome: "Odontologia",  publico: "dentistas e periodontistas" },
  mente:  { nome: "Saúde mental", publico: "psicólogos e psiquiatras" }
};

var PACOTES = [
  { id: "joelho",       nome: "Joelho",       area: "orto",   preco: 29.90, link: "", exemplos: ["Dor ao descer escada", "Menisco: o que é e como lesiona", "Joelho estalando: quando preocupar"] },
  { id: "coluna",       nome: "Coluna",       area: "orto",   preco: 29.90, link: "", exemplos: ["Dor lombar ao acordar", "Hérnia de disco em 40 segundos", "Postura no home office"] },
  { id: "ombro",        nome: "Ombro",        area: "orto",   preco: 29.90, link: "", exemplos: ["Dor ao levantar o braço", "Bursite: o que causa", "Ombro congelado existe"] },
  { id: "punho-e-mao",  nome: "Punho e mão",  area: "orto",   preco: 29.90, link: "", exemplos: ["Formigamento na mão à noite", "Tendinite de quem usa celular", "Cisto no punho tem tratamento?"] },
  { id: "pele",         nome: "Pele",         area: "derm",   preco: 29.90, link: "", exemplos: ["Mancha nova: quando procurar o médico", "Protetor solar no inverno", "Acne adulta tem causa"] },
  { id: "cabelo",       nome: "Cabelo",       area: "derm",   preco: 29.90, link: "", exemplos: ["Queda de cabelo normal ou não", "Caspa ou dermatite?", "Vitamina para cabelo funciona?"] },
  { id: "pressao-alta", nome: "Pressão alta", area: "cardio", preco: 29.90, link: "", exemplos: ["Pressão alta não dói", "Como medir a pressão em casa", "Sal escondido nos alimentos"] },
  { id: "gengiva",      nome: "Gengiva",      area: "odonto", preco: 29.90, link: "", exemplos: ["Gengiva sangrando não é normal", "Fio dental todo dia, por quê", "Mau hálito e gengiva"] },
  { id: "ansiedade",    nome: "Ansiedade",    area: "mente",  preco: 29.90, link: "", exemplos: ["Ansiedade ou estresse?", "Crise de ansiedade: o que fazer", "Respiração que acalma em 1 minuto"] }
];

/* Oferta extra no checkout: outro pacote da mesma área com desconto. */
var PRECO_ADICIONAL = 19.90;
