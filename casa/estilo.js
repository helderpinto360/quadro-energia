// Estilo "maqueta" para a casa 3D (inspirado nas apps de energia, como a da Tesla):
// arestas arredondadas, materiais foscos claros, telhado escuro, painéis brilhantes, reflexos suaves,
// sombras macias, a casa assente num plinto e luz quente nas janelas à noite.
// Aplica-se DEPOIS de construirCasa(); não altera o modelo original do projeto Home Assistant.
(function (raiz) {
  function estilizarCasa(THREE, renderer, scene, C, opcoes) {
    opcoes = opcoes || {};
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // luz de ambiente com reflexos suaves (estúdio)
    if (THREE.RoomEnvironment) {
      const pm = new THREE.PMREMGenerator(renderer);
      scene.environment = pm.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
      pm.dispose();
    }

    // ---------- paleta de maqueta ----------
    const M = C.MAT;
    const p = (k, cor, r, m, env) => { const x = M[k]; if (!x) return; if (cor) x.color.set(cor); if (r != null) x.roughness = r; if (m != null) x.metalness = m; x.envMapIntensity = env != null ? env : 0.28; x.needsUpdate = true; };
    p("paredeExt", "#e9e6e0", 0.9); p("parede", "#efece7", 0.92); p("laje", "#d9d5ce", 0.88); p("topo", "#bdbab3", 0.8);
    p("telha", "#222426", 0.82, 0, 0.1); p("madeiraFachada", "#a9784b", 0.68); p("ripa", "#f7f6f2", 0.8);
    p("relva", "#7c9c5e", 1, 0, 0.2); p("pedra", "#e6dfd1", 0.85); p("pedraVulc", "#8a3b2c", 0.95, 0, 0.2); p("betao", "#adaca7", 0.9);
    p("terra", "#25221e", 0.95, 0, 0.3); p("vedacao", "#6e5440", 0.8); p("madeira", "#c39468", 0.55); p("carvalho", "#c9a070", 0.55);
    p("branco", "#f7f6f3", 0.6); p("cinzaClaro", "#d3d4d2", 0.55, 0.1); p("cinza", "#9fa2a3", 0.6, 0.2); p("preto", "#2a2c2f", 0.45, 0.2);
    p("oliveira", "#8ea072", 0.95, 0, 0.2); p("folha", "#3f7a48", 0.95, 0, 0.2);

    // materiais que ganham verniz (clearcoat): painéis, carro, água, vidro
    const fisico = (base, o) => Object.assign(new THREE.MeshPhysicalMaterial({ color: base.color.clone(), roughness: base.roughness, metalness: base.metalness, transparent: base.transparent, opacity: base.opacity }), o);
    const troca = new Map([
      [M.pv,     fisico(M.pv,     { color: new THREE.Color("#0c1524"), roughness: 0.38, metalness: 0.2, clearcoat: 0.35, clearcoatRoughness: 0.3, envMapIntensity: 0.18 })],
      [M.tesla,  fisico(M.tesla,  { color: new THREE.Color("#f3f5f7"), roughness: 0.25, metalness: 0.3, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.7 })],
      [M.vidroCarro, fisico(M.vidroCarro, { color: new THREE.Color("#141a22"), roughness: 0.06, metalness: 0.5, clearcoat: 1, envMapIntensity: 1.6 })],
      [M.agua,   fisico(M.agua,   { color: new THREE.Color("#3db2e4"), roughness: 0.05, metalness: 0, transparent: true, opacity: 0.88, clearcoat: 1, envMapIntensity: 0.9 })],
      [M.vidro,  fisico(M.vidro,  { color: new THREE.Color("#b8d2dc"), roughness: 0.03, metalness: 0, transparent: true, opacity: 0.32, envMapIntensity: 0.9, emissive: new THREE.Color("#ffc47a"), emissiveIntensity: 0, depthWrite: false })]
    ]);
    const vidroNoite = troca.get(M.vidro);

    // ---------- geometria: arestas arredondadas e contornos discretos ----------
    const RB = THREE.RoundedBoxGeometry;
    const contorno = new THREE.LineBasicMaterial({ color: "#1b1916", transparent: true, opacity: 0.22 });
    const comContorno = new Set([M.paredeExt, M.laje, M.telha, M.madeiraFachada, M.topo, M.pedra, M.vedacao]);
    const malhas = []; C.root.traverse(o => { if (o.isMesh) malhas.push(o); });
    malhas.forEach(o => {
      if (troca.has(o.material)) o.material = troca.get(o.material);
      const g = o.geometry;
      if (RB && g && g.type === "BoxGeometry" && g.parameters) {
        const { width: w, height: h, depth: d } = g.parameters, mn = Math.min(w, h, d);
        if (mn >= 0.05 && !o.userData.semRaio) { o.geometry = new RB(w, h, d, 2, Math.min(0.06, mn * 0.28)); g.dispose(); }
      }
      if (comContorno.has(o.material) && o.geometry) {
        const l = new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry, 35), contorno);
        l.raycast = () => {}; o.add(l);
      }
    });

    // ---------- plinto: a casa assente numa base, como uma maqueta ----------
    const plinto = new THREE.Mesh(RB ? new RB(33.5, 1.1, 11.4, 3, 0.35) : new THREE.BoxGeometry(33.5, 1.1, 11.4),
      new THREE.MeshStandardMaterial({ color: "#1f1c18", roughness: 0.75, metalness: 0.05, envMapIntensity: 0.4 }));
    plinto.position.set(7, -3.78, 3.5); plinto.receiveShadow = true; scene.add(plinto);
    // halo de sombra por baixo do plinto (falsa oclusão de ambiente)
    const cv = document.createElement("canvas"); cv.width = cv.height = 256;
    const cx = cv.getContext("2d"), gr = cx.createRadialGradient(128, 128, 10, 128, 128, 128);
    gr.addColorStop(0, "rgba(0,0,0,.55)"); gr.addColorStop(1, "rgba(0,0,0,0)"); cx.fillStyle = gr; cx.fillRect(0, 0, 256, 256);
    const halo = new THREE.Mesh(new THREE.PlaneGeometry(52, 26), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cv), transparent: true, depthWrite: false }));
    halo.rotation.x = -Math.PI / 2; halo.position.set(7, -4.34, 3.5); scene.add(halo);

    // ---------- dia e noite ----------
    // k: 0 = dia pleno, 1 = noite. Escurece a exposição, acende as janelas e muda o céu (CSS do palco).
    function noite(k) {
      renderer.toneMappingExposure = 0.85 - 0.35 * k;
      vidroNoite.emissiveIntensity = 1.1 * Math.max(0, (k - 0.3) / 0.7);
      const el = opcoes.palco; if (el) el.style.setProperty("--noite", k.toFixed(3));
    }
    return { noite, plinto };
  }
  raiz.estilizarCasa = estilizarCasa;
})(typeof window !== "undefined" ? window : globalThis);
