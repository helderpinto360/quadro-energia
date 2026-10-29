// Tesla Model Y estilizado (maqueta): perfil lateral extrudido com arestas suaves, vidros escuros,
// jantes aero e barras de luz. Medidas reais aproximadas: 4,75 × 1,92 × 1,62 m.
// Devolve um THREE.Group com a frente virada para +X e as rodas assentes em y = 0.
(function (raiz) {
  function criarModelY(THREE, opcoes) {
    opcoes = opcoes || {};
    const g = new THREE.Group(); g.name = "Tesla Model Y";
    const L = 4.75, W = 1.92, folga = 0.17;
    const fis = (o) => new THREE.MeshPhysicalMaterial(Object.assign({ roughness: 0.25, metalness: 0.2, envMapIntensity: 0.6 }, o));
    const MAT = {
      corpo: fis({ color: opcoes.cor || "#f4f5f6", roughness: 0.2, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.08 }),
      vidro: fis({ color: "#10151c", roughness: 0.05, metalness: 0.4, clearcoat: 1, envMapIntensity: 0.9 }),
      pneu: new THREE.MeshStandardMaterial({ color: "#141516", roughness: 0.85 }),
      jante: fis({ color: "#3a3d41", roughness: 0.35, metalness: 0.6 }),
      embaladeira: new THREE.MeshStandardMaterial({ color: "#1d1f22", roughness: 0.6 }),
      luzFrente: new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#fff6e8", emissiveIntensity: 0.6 }),
      luzTras: new THREE.MeshStandardMaterial({ color: "#5a0d10", emissive: "#ff2a2a", emissiveIntensity: 0.5 })
    };

    // perfil lateral (x ao longo do carro, y altura), da frente (x = 0) para trás
    const s = new THREE.Shape();
    s.moveTo(0.05, folga + 0.18);
    s.quadraticCurveTo(0.0, 0.62, 0.12, 0.74);          // para-choques
    s.quadraticCurveTo(0.45, 0.86, 1.15, 0.93);         // capô
    s.lineTo(1.3, 0.96);
    s.lineTo(4.25, 1.02);                               // linha de cintura (base dos vidros, por trás do vidro)
    s.quadraticCurveTo(4.62, 1.0, 4.72, 0.86);          // traseira
    s.quadraticCurveTo(4.78, 0.6, 4.7, folga + 0.2);
    s.lineTo(0.05, folga + 0.18);
    const ext = { depth: W - 0.16, bevelEnabled: true, bevelThickness: 0.08, bevelSize: 0.08, bevelSegments: 5, curveSegments: 24 };
    const corpoG = new THREE.ExtrudeGeometry(s, ext); corpoG.translate(-L / 2, 0, -(W - 0.16) / 2);
    const corpo = new THREE.Mesh(corpoG, MAT.corpo); corpo.castShadow = true; corpo.receiveShadow = true; corpo.name = "Tesla Model Y"; g.add(corpo);

    // cabine: vidros escuros (para-brisas, tejadilho em vidro, óculo traseiro) com moldura branca nos pilares
    const c = new THREE.Shape();
    c.moveTo(1.3, 0.95);
    c.quadraticCurveTo(1.75, 1.32, 2.15, 1.55);         // para-brisas
    c.quadraticCurveTo(2.6, 1.63, 3.2, 1.6);            // tejadilho
    c.quadraticCurveTo(3.95, 1.5, 4.4, 1.1);            // traseira em fastback
    c.lineTo(4.38, 1.0);
    c.lineTo(1.3, 0.95);
    const cabG = new THREE.ExtrudeGeometry(c, { depth: W - 0.42, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 4, curveSegments: 24 });
    cabG.translate(-L / 2, 0, -(W - 0.42) / 2);
    const cab = new THREE.Mesh(cabG, MAT.vidro); cab.castShadow = true; g.add(cab);
    // pilar B e friso do tejadilho em branco (dá a leitura das portas)
    const pilar = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, W - 0.3), MAT.corpo); pilar.position.set(2.75 - L / 2, 1.3, 0); g.add(pilar);

    // embaladeiras escuras e cavas das rodas
    const emb = new THREE.Mesh(new THREE.BoxGeometry(L - 1.0, 0.12, W - 0.02), MAT.embaladeira); emb.position.set(0.05, folga + 0.22, 0); g.add(emb);

    // rodas: pneu + jante aero
    const eixos = [0.98, 3.85];
    eixos.forEach(x => [-1, 1].forEach(lado => {
      const r = 0.36, larg = 0.26;
      const pneu = new THREE.Mesh(new THREE.CylinderGeometry(r, r, larg, 32), MAT.pneu);
      pneu.rotation.x = Math.PI / 2; pneu.position.set(x - L / 2, r, lado * (W / 2 - larg / 2 + 0.02)); pneu.castShadow = true; g.add(pneu);
      const jante = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.03, 32), MAT.jante);
      jante.rotation.x = Math.PI / 2; jante.position.set(x - L / 2, r, lado * (W / 2 + 0.02)); g.add(jante);
      const centro = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.035, 16), MAT.corpo);
      centro.rotation.x = Math.PI / 2; centro.position.set(x - L / 2, r, lado * (W / 2 + 0.035)); g.add(centro);
    }));

    // barras de luz
    const fr = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.035, W - 0.5), MAT.luzFrente); fr.position.set(0.16 - L / 2, 0.76, 0); g.add(fr);
    const tr = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.05, W - 0.3), MAT.luzTras); tr.position.set(4.72 - L / 2, 0.9, 0); g.add(tr);

    g.userData.materiais = MAT;
    return g;
  }
  raiz.criarModelY = criarModelY;
})(typeof window !== "undefined" ? window : globalThis);
