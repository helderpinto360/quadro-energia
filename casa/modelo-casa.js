// Modelo da casa, em metros.
// Eixos: x = comprimento, da rua (poente, x=0) para o jardim (nascente);
//        y = largura, de 0 (parede com WC, cozinha e escada) a 7 (parede da sala);
//        z = altura, com o pavimento do R/C a 0.
// Fonte: planta "Moradia M3.pdf" (1:100) e cotas anotadas; medidas interiores
// arredondadas ao decímetro. Alturas assumidas: pé-direito 2,70 m.
window.MODELO_CASA = {
  pisos: [
    { id: "cave", nome: "Cave", z: -3.0, h: 2.7 },
    { id: "rc", nome: "R/C", z: 0, h: 2.75 },
    { id: "p1", nome: "1.º andar", z: 3.0, h: 2.7 }
  ],
  // Contorno exterior de cada piso (paredes de 0,24 m)
  contorno: {
    cave: { x0: 0.5, x1: 15.7, y0: 0, y1: 7.0 },
    rc: { x0: 1.0, x1: 14.75, y0: 0, y1: 7.0 },
    p1: { x0: 1.0, x1: 14.75, y0: 0, y1: 7.0 }
  },
  // Fachadas envidraçadas (poente e nascente) por piso
  vidros: [
    { piso: "rc", x: 1.0, y0: 2.0, y1: 6.76 },
    { piso: "rc", x: 14.75, y0: 0.24, y1: 6.76 },
    { piso: "p1", x: 1.0, y0: 2.2, y1: 6.76 },
    { piso: "p1", x: 14.75, y0: 0.24, y1: 6.76 }
  ],
  portas: [
    { piso: "rc", tipo: "entrada", x: 1.0, y0: 0.6, y1: 1.6 },
    { piso: "cave", tipo: "portao", x: 0.5, y0: 3.4, y1: 6.6 }
  ],
  divisoes: [
    // Cave
    { id: "garagem", nome: "Garagem", piso: "cave", x0: 0.74, x1: 10.5, y0: 3.1, y1: 6.76, chao: "betao",
      dispositivos: ["Tesla Model Y", "Impressora Bambu Lab P2S"] },
    { id: "maquinas", nome: "Casa das máquinas", piso: "cave", x0: 0.74, x1: 4.2, y0: 0.24, y1: 3.0, chao: "betao",
      dispositivos: ["Inversor Deye 5 kW", "Baterias Felicity 20,5 kWh", "Bomba de calor AQS Baxi (Shelly)", "Máquina Lavar Roupa (Shelly)", "Máquina Secar (Shelly)"] },
    { id: "arrumo", nome: "Arrumo", piso: "cave", x0: 4.3, x1: 5.3, y0: 0.24, y1: 3.0, chao: "betao", dispositivos: [] },
    { id: "ginasio", nome: "Ginásio", piso: "cave", x0: 10.5, x1: 15.46, y0: 0.24, y1: 6.76, chao: "borracha",
      dispositivos: ["Sensor Ginásio (Shelly BLU)", "TV do ginásio", "Coluna Gym (Apple)"] },
    { id: "oficina", nome: "Oficina", piso: "cave", x0: 5.3, x1: 10.5, y0: 0.24, y1: 3.1, chao: "betao",
      dispositivos: ["Frigorífico Americano (Shelly)"] },
    // R/C
    { id: "entrada", nome: "Entrada", piso: "rc", x0: 1.24, x1: 3.8, y0: 0.24, y1: 2.0, chao: "madeira",
      dispositivos: [] },
    { id: "wc_rc", nome: "WC R/C", piso: "rc", x0: 3.9, x1: 6.6, y0: 0.24, y1: 1.85, chao: "marmore", dispositivos: [] },
    { id: "esc_cave", nome: "Escada da cave", piso: "rc", x0: 6.7, x1: 8.7, y0: 0.24, y1: 1.85, chao: "madeira",
      dispositivos: [] },
    { id: "sala", nome: "Sala", piso: "rc", x0: 1.24, x1: 9.2, y0: 2.0, y1: 6.76, chao: "madeira",
      dispositivos: ["Sala Iluminação + Sancas (Shelly)", "Candeeiro Pé Sala (Shelly)", "Estore Sala 1 e 2 (Shelly)", "Interruptor Sala 4 teclas (Shelly)", "Sensor Sala (Shelly BLU)", "AC Biblioteca (Samsung)", "Televisão Sala (Samsung)"] },
    { id: "jantar", nome: "Jantar", piso: "rc", x0: 9.2, x1: 14.51, y0: 3.6, y1: 6.76, chao: "madeira",
      dispositivos: ["AC cozinha (Samsung)"] },
    { id: "cozinha", nome: "Cozinha", piso: "rc", x0: 8.8, x1: 14.51, y0: 0.24, y1: 3.6, chao: "mosaico",
      dispositivos: ["Iluminação Cozinha + Sancas (Shelly)", "Candeeiro Pé Cozinha (Shelly)", "Estores Cozinha 1–3 (Shelly)", "Sensor Cozinha (Shelly BLU)"] },
    // 1.º andar
    { id: "suite", nome: "Suite", piso: "p1", x0: 1.24, x1: 5.3, y0: 2.4, y1: 6.76, chao: "madeira",
      dispositivos: ["Estore Suite 1 (offline)", "Estore Suite 2 (Shelly)", "Sensor Suite (Shelly BLU)", "AC Quarto Pai e Mãe (Samsung)"] },
    { id: "closet", nome: "Closet", piso: "p1", x0: 1.24, x1: 3.2, y0: 0.24, y1: 2.4, chao: "madeira", dispositivos: [] },
    { id: "wc_suite", nome: "WC suite", piso: "p1", x0: 3.2, x1: 5.3, y0: 0.24, y1: 2.35, chao: "marmore", dispositivos: [] },
    { id: "wc_p1", nome: "WC comum", piso: "p1", x0: 6.6, x1: 9.6, y0: 0.24, y1: 1.85, chao: "marmore", dispositivos: [] },
    { id: "galeria", nome: "Galeria", piso: "p1", x0: 5.3, x1: 10.66, y0: 1.85, y1: 3.9, chao: "madeira",
      dispositivos: [] },
    { id: "rapazes", nome: "Quarto rapazes", piso: "p1", x0: 10.76, x1: 14.51, y0: 0.24, y1: 3.24, chao: "madeira",
      dispositivos: ["Luz Rapazes (Shelly)", "Estores Rapazes (Shelly)", "Sensor Rapazes (Shelly BLU)", "AC Rapazes (Samsung)", "Sanca LED (sem Shelly)"] },
    { id: "raparigas", nome: "Quarto raparigas", piso: "p1", x0: 10.76, x1: 14.51, y0: 3.34, y1: 6.76, chao: "madeira",
      dispositivos: ["Estores Raparigas (Shelly)", "Sensor Raparigas (Shelly BLU)", "AC Quarto Miúdas (offline)", "Sanca LED (sem Shelly)"] },
    // Exterior
    { id: "jardim", nome: "Jardim e piscina", piso: "rc", x0: 14.75, x1: 21.7, y0: 0, y1: 7.0, chao: "relva", exterior: true,
      dispositivos: ["Pisc 0–3: luz do fundo e projetores (Shelly)", "Sensor Temperatura Piscina (Shelly)", "Bomba de calor FITT INT 60 (Smart Life)"] },
    { id: "frente", nome: "Jardim da frente", piso: "rc", z: -1.1, x0: -7.5, x1: -1.4, y0: 0, y1: 3.0, chao: "relva", exterior: true,
      dispositivos: ["Iluminação jardim frente 1 e 2 (Shelly)", "Caixa do correio (Shelly)", "Sensor Temperatura Jardim Frente (Shelly)"] }
  ],
  // Paredes interiores: [piso, x0, x1, y0, y1]
  paredes: [
    ["cave", 0.74, 4.2, 3.0, 3.1], ["cave", 4.2, 4.3, 0.24, 3.1], ["cave", 5.3, 5.4, 0.24, 2.2], ["cave", 4.3, 5.3, 3.0, 3.1],
    ["rc", 3.8, 3.9, 0.24, 1.85], ["rc", 3.9, 6.6, 1.85, 1.95], ["rc", 6.6, 6.7, 0.24, 1.95], ["rc", 8.7, 8.8, 0.24, 1.95],
    ["p1", 1.24, 2.0, 2.35, 2.45], ["p1", 3.2, 5.3, 2.35, 2.45], ["p1", 5.3, 5.4, 0.24, 2.45], ["p1", 5.3, 5.4, 3.3, 6.76],
    ["p1", 6.5, 6.6, 0.24, 1.95], ["p1", 6.6, 9.6, 1.85, 1.95], ["p1", 9.6, 9.7, 0.24, 1.95],
    ["p1", 10.66, 10.76, 0.24, 2.3], ["p1", 10.66, 10.76, 3.2, 3.5], ["p1", 10.66, 10.76, 4.4, 6.76], ["p1", 10.76, 14.51, 3.24, 3.34],
    ["p1", 3.2, 3.3, 0.24, 2.4]
  ],
  // Vazio do pé-direito duplo sobre a sala (sem laje no 1.º andar)
  vazio: { x0: 5.4, x1: 10.66, y0: 3.9, y1: 6.76 },
  escadas: [
    { de: "rc", para: "p1", x0: 4.6, x1: 9.4, y0: 1.95, y1: 3.0, sobe: "x-" },
    { de: "cave", para: "rc", x0: 5.4, x1: 8.7, y0: 2.0, y1: 3.0, sobe: "x+" }
  ],
  // Ripas brancas entre a escada e a sala
  ripas: { piso: "rc", x0: 4.6, x1: 9.4, y: 3.05 },
  piscina: { x0: 18.8, x1: 21.8, y0: 0.6, y1: 6.45, z: -0.05 },
  // Mobiliário principal: [piso, x0, x1, y0, y1, altura, cor]
  moveis: [
    // R/C
    ["rc", 1.4, 3.7, 0.3, 0.9, 2.4, "branco"],
    ["rc", 8.9, 14.4, 0.24, 0.85, 0.9, "bege"], ["rc", 8.9, 9.5, 0.24, 0.85, 2.4, "bege"],
    ["rc", 11.0, 12.9, 2.1, 3.0, 0.95, "verdeagua"],
    ["rc", 10.3, 12.5, 4.5, 5.6, 0.75, "pedra"],
    ["rc", 3.0, 3.9, 4.0, 6.3, 0.75, "cinza"], ["rc", 4.4, 5.2, 3.5, 4.3, 0.8, "linho"], ["rc", 5.4, 6.2, 3.5, 4.3, 0.8, "linho"],
    ["rc", 4.2, 8.0, 6.35, 6.76, 0.45, "branco"], ["rc", 5.4, 6.8, 6.6, 6.7, 1.2, "ecra"],
    ["rc", 1.6, 2.5, 4.3, 6.6, 0.75, "cinza"],
    // 1.º andar
    ["p1", 2.2, 4.2, 4.3, 6.3, 0.5, "branco"], ["p1", 1.24, 3.2, 0.24, 0.85, 2.6, "branco"],
    ["p1", 12.4, 14.4, 0.3, 1.2, 1.6, "branco"], ["p1", 11.0, 13.0, 2.5, 3.2, 0.75, "carvalho"],
    ["p1", 12.4, 14.4, 5.8, 6.7, 1.6, "branco"], ["p1", 11.0, 13.0, 3.4, 4.1, 0.75, "carvalho"],
    // Cave
    ["cave", 1.6, 6.3, 4.1, 6.0, 1.6, "tesla"],
    ["cave", 6.5, 9.0, 0.3, 1.0, 0.9, "carvalho"], ["cave", 7.5, 8.0, 0.4, 0.9, 1.4, "preto"],
    ["cave", 13.0, 15.3, 0.4, 1.6, 2.1, "preto"], ["cave", 11.2, 12.4, 5.2, 6.6, 1.5, "preto"],
    ["cave", 1.0, 1.7, 0.4, 1.2, 1.9, "branco"], ["cave", 2.0, 2.6, 0.4, 1.1, 1.8, "branco"],
    // Jardim
    ["rc", 15.4, 16.4, 0.3, 1.0, 1.0, "preto"], ["rc", 16.6, 18.2, 4.8, 6.6, 0.4, "linho"]
  ],
  // Dispositivos com posição (para pontos no modelo): [piso, x, y, z relativo ao piso, tipo]
  pontos: [
    ["cave", 1.2, 6.2, 2.4], ["cave", 13.5, 3.5, 2.5], ["rc", 14.6, 0.5, 2.4],
    ["rc", 0.8, 1.9, 2.4], ["rc", 8.0, 1.2, 2.5], ["rc", 14.4, 6.6, 2.5],
    ["rc", 4.5, 6.7, 2.3, "ac"], ["rc", 12.5, 6.7, 2.3, "ac"], ["p1", 2.0, 6.7, 2.3, "ac"], ["p1", 11.5, 3.2, 2.3, "ac"], ["p1", 11.5, 3.4, 2.3, "ac"],
    ["rc", 3.0, 0.3, 1.4, "sensor"], ["p1", 13.0, 0.3, 1.4, "sensor"], ["p1", 13.0, 6.7, 1.4, "sensor"], ["p1", 2.0, 2.5, 1.4, "sensor"], ["cave", 14.0, 6.7, 1.4, "sensor"],
    ["cave", 1.5, 1.5, 1.2, "energia"], ["cave", 2.4, 0.4, 1.2, "energia"]
  ]
};
