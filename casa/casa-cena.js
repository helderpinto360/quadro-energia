// Constrói a cena 3D da casa a partir de window.MODELO_CASA.
// Usado pela página (three r128, global) e pelo script de exportação GLB (Node, three 0.160).
// Coordenadas da planta (x, y, z) -> three (X = x, Y = z, Z = y).
(function (raiz) {
  function construirCasa(THREE, M, opcoes) {
    opcoes = opcoes || {};
    const root = new THREE.Group(); root.name = "Casa";
    const grupos = {};
    ["cave", "rc", "p1", "telhado", "exterior", "energia"].forEach(n => { grupos[n] = new THREE.Group(); grupos[n].name = n; root.add(grupos[n]); });
    const paredes = [];      // { mesh, z0, h } para o corte "casa de bonecas"
    const pickables = [], roomByMesh = new Map(), luzes = [];

    const mat = (c, o) => new THREE.MeshStandardMaterial(Object.assign({ color: c, roughness: 0.8, metalness: 0 }, o || {}));
    const MAT = {
      parede: mat("#eceae6"), paredeExt: mat("#e3e5e6"), laje: mat("#cfd2d4"), topo: mat("#9aa0a4"),
      madeira: mat("#bb8a58", { roughness: 0.55 }), mosaico: mat("#a3a7a8", { roughness: 0.45 }), marmore: mat("#eef0f0", { roughness: 0.25 }),
      betao: mat("#8d9093"), borracha: mat("#26292b"), relva: mat("#4f8a3c"), pedra: mat("#d6cdbd"), terra: mat("#2a2f33"),
      pedraVulc: mat("#7a2e24"), oliveira: mat("#7f8f6a"), folha: mat("#2f6b3a"),
      vidro: new THREE.MeshStandardMaterial({ color: "#a9c6d2", transparent: true, opacity: 0.22, roughness: 0.05, metalness: 0.1 }),
      caixilho: mat("#3a3d3f"), ripa: mat("#f6f6f4"), degrau: mat("#c08e5a", { roughness: 0.55 }), viga: mat("#2a2a2a"),
      agua: new THREE.MeshStandardMaterial({ color: "#36a3d9", transparent: true, opacity: 0.88, roughness: 0.08, emissive: "#000000" }),
      telha: mat("#c9ced1", { roughness: 0.45, metalness: 0.35 }), madeiraFachada: mat("#b87a3e"), vedacao: mat("#6b4f38"),
      branco: mat("#f4f4f2"), bege: mat("#d6cab8"), verdeagua: mat("#bfe0d6", { roughness: 0.15 }), cinza: mat("#9a9d9f"),
      cinzaClaro: mat("#c4c6c7"), linho: mat("#e4ddd1"), ecra: mat("#0c0d0f", { roughness: 0.15 }), carvalho: mat("#c79a64"),
      preto: mat("#25272a"), caramelo: mat("#a8642f"), rosa: mat("#c48f7c"), tecido: mat("#7e8a95"),
      tesla: mat("#eef1f4", { roughness: 0.25, metalness: 0.45 }), vidroCarro: mat("#1c2430", { roughness: 0.1, metalness: 0.6 }),
      pneu: mat("#151617"), inox: mat("#c9ccce", { roughness: 0.3, metalness: 0.7 }), pv: mat("#16243b", { roughness: 0.2, metalness: 0.45 }),
      ledAzul: new THREE.MeshStandardMaterial({ color: "#2f8fff", emissive: "#2f8fff", emissiveIntensity: 0 })
    };
    const zP = Object.fromEntries(M.pisos.map(p => [p.id, p.z]));
    const hP = Object.fromEntries(M.pisos.map(p => [p.id, p.h]));

    function caixa(g, x0, x1, y0, y1, z0, z1, m, nome) {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(Math.max(x1 - x0, 0.01), Math.max(z1 - z0, 0.01), Math.max(y1 - y0, 0.01)), m);
      mesh.position.set((x0 + x1) / 2, (z0 + z1) / 2, (y0 + y1) / 2);
      mesh.castShadow = true; mesh.receiveShadow = true;
      if (nome) mesh.name = nome;
      g.add(mesh); return mesh;
    }
    function parede(g, x0, x1, y0, y1, z0, h, m) {
      const mesh = caixa(g, x0, x1, y0, y1, z0, z0 + h, m);
      paredes.push({ mesh, z0, h }); return mesh;
    }
    function cil(g, x, y, z0, h, r, m, seg) {
      const mesh = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, seg || 20), m);
      mesh.position.set(x, z0 + h / 2, y); mesh.castShadow = true; mesh.receiveShadow = true; g.add(mesh); return mesh;
    }
    function esfera(g, x, y, z, r, m) {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r, 16, 12), m);
      mesh.position.set(x, z, y); mesh.castShadow = true; g.add(mesh); return mesh;
    }

    // ---------- Mobiliário ----------
    const F = {
      cama(g, z, x0, x1, y0, y1, colcha) {
        caixa(g, x0, x1, y0, y1, z, z + 0.32, MAT.branco);
        caixa(g, x0 + 0.04, x1 - 0.04, y0 + 0.04, y1 - 0.04, z + 0.32, z + 0.5, MAT.linho);
        if (colcha) caixa(g, x0 + 0.03, x1 - 0.03, y0 + (y1 - y0) * 0.45, y0 + (y1 - y0) * 0.75, z + 0.5, z + 0.53, colcha);
      },
      beliche(g, z, x0, x1, y0, y1) {
        [[x0, y0], [x1 - 0.06, y0], [x0, y1 - 0.06], [x1 - 0.06, y1 - 0.06]].forEach(([x, y]) => caixa(g, x, x + 0.06, y, y + 0.06, z, z + 1.6, MAT.branco));
        caixa(g, x0, x1, y0, y1, z + 0.25, z + 0.45, MAT.linho); caixa(g, x0, x1, y0, y1, z + 1.25, z + 1.42, MAT.linho);
        caixa(g, x0, x1, y0, y0 + 0.04, z + 1.42, z + 1.6, MAT.branco);
      },
      sofa(g, z, x0, x1, y0, y1, costas, m) {
        m = m || MAT.cinzaClaro;
        caixa(g, x0, x1, y0, y1, z, z + 0.42, m);
        const t = 0.2;
        const c = { "y+": [x0, x1, y1 - t, y1], "y-": [x0, x1, y0, y0 + t], "x+": [x1 - t, x1, y0, y1], "x-": [x0, x0 + t, y0, y1] }[costas];
        caixa(g, c[0], c[1], c[2], c[3], z, z + 0.8, m);
      },
      mesa(g, z, x0, x1, y0, y1, h, tampo, cadeiras, corCad) {
        caixa(g, x0, x1, y0, y1, z + h - 0.05, z + h, tampo);
        caixa(g, x0 + 0.1, x1 - 0.1, (y0 + y1) / 2 - 0.05, (y0 + y1) / 2 + 0.05, z, z + h - 0.05, MAT.carvalho);
        if (cadeiras) {
          const n = cadeiras / 2, passo = (x1 - x0) / n;
          for (let i = 0; i < n; i++) {
            const cx = x0 + passo * (i + 0.5);
            [[y0 - 0.5, y0 - 0.05], [y1 + 0.05, y1 + 0.5]].forEach(([a, b]) => {
              caixa(g, cx - 0.22, cx + 0.22, a, b, z, z + 0.46, corCad || MAT.preto);
              const enc = a < y0 ? [a, a + 0.06] : [b - 0.06, b];
              caixa(g, cx - 0.22, cx + 0.22, enc[0], enc[1], z + 0.46, z + 0.78, MAT.preto);
            });
          }
        }
      },
      planta(g, x, y, z, h) { cil(g, x, y, z, 0.35, 0.18, MAT.branco); esfera(g, x, y, z + h, 0.35, MAT.folha); cil(g, x, y, z + 0.35, h - 0.35, 0.02, MAT.carvalho); },
      tapete(g, z, x0, x1, y0, y1, m) { caixa(g, x0, x1, y0, y1, z, z + 0.012, m); },
      carro(g, z, x0, x1, y0, y1) {
        caixa(g, x0 + 0.1, x1 - 0.1, y0, y1, z + 0.18, z + 0.85, MAT.tesla);
        caixa(g, x0 + 1.1, x1 - 1.0, y0 + 0.12, y1 - 0.12, z + 0.85, z + 1.45, MAT.vidroCarro);
        caixa(g, x0 + 1.2, x1 - 1.1, y0 + 0.15, y1 - 0.15, z + 1.45, z + 1.5, MAT.tesla);
        [[x0 + 0.75, y0 + 0.08], [x1 - 0.75, y0 + 0.08], [x0 + 0.75, y1 - 0.08], [x1 - 0.75, y1 - 0.08]].forEach(([x, y]) => {
          const r = cil(g, x, y, z, 0.24, 0.36, MAT.pneu); r.rotation.x = Math.PI / 2; r.position.set(x, z + 0.36, y);
        });
      },
      tv(g, x0, x1, y, z, h, lado) { caixa(g, x0, x1, y - 0.04 * lado, y, z, z + h, MAT.ecra); }
    };

    // ---------- Terreno, jardins e piscina ----------
    const ex = grupos.exterior, zRua = -1.1;
    caixa(ex, -9, 23, -1.5, 8.5, -3.25, -3.15, MAT.terra);
    caixa(ex, 14.75, 22.2, 0, 7, -0.1, 0, MAT.relva);
    caixa(ex, 14.75, 16.2, 0, 7, -0.08, 0.01, MAT.pedra);
    caixa(ex, 16.2, 18.4, 3.9, 7, -0.08, 0.06, MAT.carvalho); // deck
    caixa(ex, -7.5, -1.4, 0, 3.0, zRua - 0.1, zRua, MAT.pedraVulc);
    caixa(ex, -7.5, -1.4, 0.55, 2.45, zRua - 0.09, zRua + 0.005, MAT.relva);
    caixa(ex, -7.5, -1.4, 1.0, 2.0, zRua - 0.08, zRua + 0.01, MAT.pedra);
    for (let i = 0; i < 6; i++) caixa(ex, -1.4 + i * 0.3, 1.0, 0.9, 2.1, zRua, zRua + (i + 1) * 0.183, MAT.pedra);
    caixa(ex, 0.4, 1.0, 0.24, 2.0, -0.25, 0, MAT.pedra);
    [[-0.15, 0.0], [3.0, 3.15], [6.95, 7.1]].forEach(([c0, c1]) => caixa(ex, -7.5, 1.0, c0, c1, -3.0, 0.3, MAT.paredeExt));
    [[-5.2, 0.4], [-2.6, 2.6]].forEach(([x, y]) => {
      cil(ex, x, y, zRua, 1.4, 0.04, MAT.carvalho);
      [0.7, 1.05, 1.4].forEach(h => esfera(ex, x, y, zRua + h, 0.22, MAT.oliveira));
    });
    const rampa = caixa(ex, -7.5, 0.5, 3.2, 6.8, -0.15, 0, MAT.betao);
    rampa.geometry = new THREE.BoxGeometry(Math.hypot(8.0, 3.0 + zRua), 0.15, 3.6);
    rampa.position.set(-3.5, (zRua - 3.0) / 2 - 0.07, 5.0);
    rampa.rotation.z = -Math.atan2(3.0 + zRua, 8.0);
    caixa(ex, 14.75, 22.2, -0.1, 0.05, 0, 1.8, MAT.vedacao);
    caixa(ex, 14.75, 22.2, 6.95, 7.1, 0, 1.8, MAT.vedacao);
    caixa(ex, 22.2, 22.35, -0.1, 7.1, 0, 1.8, MAT.vedacao);
    const P = M.piscina;
    caixa(ex, P.x0 - 0.35, P.x1 + 0.35, P.y0 - 0.35, P.y1 + 0.35, -0.02, 0.04, MAT.pedra);
    const agua = caixa(ex, P.x0, P.x1, P.y0, P.y1, -0.12, 0.045, MAT.agua, "Piscina");
    caixa(ex, P.x0 + 0.05, P.x1 - 0.05, P.y0 + 0.05, P.y1 - 0.05, -0.14, -0.12, MAT.ledAzul);
    caixa(ex, 15.4, 16.3, 0.3, 0.95, 0, 1.0, MAT.preto, "Grelhador");
    F.sofa(ex, 0.06, 16.4, 18.2, 6.0, 6.8, "y+", MAT.linho);
    F.sofa(ex, 0.06, 16.4, 17.2, 4.2, 6.0, "x-", MAT.linho);
    cil(ex, 17.6, 2.0, 0, 0.05, 0.25, MAT.preto); esfera(ex, 17.6, 2.0, 1.3, 0.55, MAT.caramelo); // cadeira suspensa
    caixa(ex, 21.9, 22.2, 0.2, 1.4, 0, 0.9, MAT.pedra, "Casa das máquinas da piscina");
    caixa(ex, 21.92, 22.18, 0.3, 1.3, 0.9, 1.6, MAT.cinza, "Bomba de calor FITT");

    // ---------- Pisos: lajes, paredes exteriores, fachadas ----------
    M.pisos.forEach(p => {
      const c = M.contorno[p.id], g = grupos[p.id], t = 0.24, z0 = p.z, h = p.h;
      if (p.id === "p1") {
        const v = M.vazio;
        caixa(g, c.x0, v.x0, c.y0, c.y1, z0 - 0.25, z0 - 0.02, MAT.laje);
        caixa(g, v.x1, c.x1, c.y0, c.y1, z0 - 0.25, z0 - 0.02, MAT.laje);
        caixa(g, v.x0, v.x1, c.y0, v.y0, z0 - 0.25, z0 - 0.02, MAT.laje);
        caixa(g, v.x0, v.x1, v.y0 - 0.03, v.y0 + 0.03, z0, z0 + 1.0, MAT.vidro);
      } else caixa(g, c.x0, c.x1, c.y0, c.y1, z0 - 0.25, z0 - 0.02, MAT.laje);
      parede(g, c.x0, c.x1, c.y0, c.y0 + t, z0, h, MAT.paredeExt);
      parede(g, c.x0, c.x1, c.y1 - t, c.y1, z0, h, MAT.paredeExt);
      const vid = M.vidros.filter(v => v.piso === p.id);
      [c.x0, c.x1].forEach((xw, i) => {
        const xa = i === 0 ? xw : xw - t, xb = i === 0 ? xw + t : xw;
        const v = vid.find(q => Math.abs(q.x - xw) < 0.01);
        const porta = (M.portas || []).find(q => q.piso === p.id && Math.abs(q.x - xw) < 0.01);
        if (v) {
          if (v.y0 > c.y0 + t + 0.01) {
            const segs = porta ? [[c.y0 + t, porta.y0], [porta.y1, v.y0]] : [[c.y0 + t, v.y0]];
            segs.forEach(([a, b]) => { if (b > a) parede(g, xa, xb, a, b, z0, h, MAT.madeiraFachada); });
            if (porta) caixa(g, xa, xb, porta.y0, porta.y1, z0 + 2.3, z0 + h, MAT.madeiraFachada);
          }
          if (v.y1 < c.y1 - t - 0.01) parede(g, xa, xb, v.y1, c.y1 - t, z0, h, MAT.paredeExt);
          caixa(g, xw - 0.02, xw + 0.02, v.y0, v.y1, z0, z0 + h, MAT.vidro);
          caixa(g, xw - 0.04, xw + 0.04, v.y0, v.y1, z0 + h - 0.08, z0 + h, MAT.caixilho);
        } else if (porta) {
          parede(g, xa, xb, c.y0 + t, porta.y0, z0, h, MAT.paredeExt);
          parede(g, xa, xb, porta.y1, c.y1 - t, z0, h, MAT.paredeExt);
          caixa(g, xa, xb, porta.y0, porta.y1, z0, z0 + 2.4, MAT.cinza, "Portão da garagem");
        } else parede(g, xa, xb, c.y0 + t, c.y1 - t, z0, h, MAT.paredeExt);
      });
    });
    // Varandas da fachada da rua
    caixa(grupos.rc, 0.0, 1.0, 2.0, 6.76, -0.25, 0, MAT.pedra);
    caixa(grupos.rc, 0.0, 0.05, 2.0, 6.76, 0, 1.0, MAT.vidro);
    caixa(grupos.p1, 0.2, 1.0, 0.24, 6.76, 2.75, 3.0, MAT.paredeExt);
    caixa(grupos.p1, 0.2, 0.25, 0.24, 6.76, 3.0, 4.0, MAT.vidro);

    // ---------- Divisões (pavimentos clicáveis) ----------
    M.divisoes.forEach(d => {
      const z = d.z !== undefined ? d.z : zP[d.piso];
      const g = d.exterior ? ex : grupos[d.piso];
      const mesh = caixa(g, d.x0, d.x1, d.y0, d.y1, z - 0.02, z + (d.exterior ? 0.015 : 0.0), (MAT[d.chao] || MAT.madeira).clone(), "Divisão " + d.nome);
      mesh.castShadow = false;
      pickables.push(mesh); roomByMesh.set(mesh, d);
      if (!d.exterior && opcoes.luzes !== false) {
        const luz = new THREE.PointLight(0xffc27a, 0, 6.5, 2);
        luz.position.set((d.x0 + d.x1) / 2, z + hP[d.piso] - 0.4, (d.y0 + d.y1) / 2);
        grupos[d.piso].add(luz); luzes.push({ luz, d });
      }
    });
    M.paredes.forEach(([p, x0, x1, y0, y1]) => parede(grupos[p], x0, x1, y0, y1, zP[p], hP[p], MAT.parede));

    // ---------- Escadas e ripas ----------
    M.escadas.forEach(e => {
      const z0 = zP[e.de], z1 = zP[e.para], n = 16, g = grupos[e.de], dx = (e.x1 - e.x0) / n;
      for (let i = 0; i < n; i++) {
        const xa = e.sobe === "x+" ? e.x0 + i * dx : e.x1 - (i + 1) * dx, zz = z0 + (z1 - z0) * (i + 1) / n;
        caixa(g, xa, xa + dx * 0.95, e.y0, e.y1, zz - 0.05, zz, MAT.degrau);
      }
      const L = e.x1 - e.x0, H = z1 - z0;
      const viga = caixa(g, e.x0, e.x1, e.y0, e.y1, z0, z0 + 0.2, MAT.viga);
      viga.geometry = new THREE.BoxGeometry(Math.hypot(L, H), 0.2, 0.16);
      viga.position.set((e.x0 + e.x1) / 2, (z0 + z1) / 2 - 0.15, (e.y0 + e.y1) / 2);
      viga.rotation.z = (e.sobe === "x+" ? 1 : -1) * Math.atan2(H, L);
    });
    { const r = M.ripas, z = zP[r.piso];
      for (let x = r.x0; x <= r.x1; x += 0.16) parede(grupos.rc, x, x + 0.04, r.y, r.y + 0.06, z, 2.75, MAT.ripa); }

    // ---------- Mobiliário por divisão ----------
    const rc = grupos.rc, p1 = grupos.p1, cv = grupos.cave, zr = 0, z1 = zP.p1, zc = zP.cave;
    // Entrada
    caixa(rc, 1.4, 3.7, 0.26, 0.85, zr, zr + 2.4, MAT.branco, "Roupeiros da entrada");
    // Sala (zona TV) e zona de leitura junto à rua
    F.tapete(rc, zr, 3.6, 7.2, 3.6, 6.0, MAT.preto);
    F.sofa(rc, zr, 4.0, 6.8, 3.4, 4.4, "y-", MAT.cinzaClaro);
    F.sofa(rc, zr, 6.9, 7.7, 4.6, 5.5, "x+", MAT.linho); F.sofa(rc, zr, 6.9, 7.7, 5.6, 6.5, "x+", MAT.linho);
    cil(rc, 5.4, 5.1, zr, 0.4, 0.45, MAT.caramelo);
    caixa(rc, 3.6, 8.2, 6.35, 6.76, zr, zr + 0.45, MAT.branco, "Móvel TV");
    F.tv(rc, 4.9, 6.6, 6.72, zr + 1.0, 0.95, 1);
    caixa(rc, 4.0, 4.6, 6.4, 6.76, zr + 1.6, zr + 4.8, MAT.carvalho); caixa(rc, 6.9, 7.6, 6.4, 6.76, zr + 1.6, zr + 4.8, MAT.branco);
    F.sofa(rc, zr, 1.5, 2.4, 3.9, 6.5, "x-", MAT.cinzaClaro);
    caixa(rc, 2.8, 3.5, 6.3, 6.76, zr, zr + 2.0, MAT.carvalho, "Estante");
    caixa(rc, 2.6, 3.2, 4.6, 5.3, zr, zr + 0.95, MAT.caramelo, "Cadeira de lounge");
    cil(rc, 2.6, 3.3, zr, 0.012, 0.75, MAT.linho);
    F.planta(rc, 8.6, 6.3, zr, 1.9);
    // Jantar
    F.tapete(rc, zr, 9.8, 12.8, 3.9, 6.4, MAT.cinzaClaro);
    F.mesa(rc, zr, 10.2, 12.4, 4.7, 5.6, 0.76, MAT.pedra, 8, MAT.caramelo);
    caixa(rc, 10.6, 12.6, 6.35, 6.76, zr, zr + 0.8, MAT.carvalho, "Aparador");
    F.planta(rc, 13.6, 6.3, zr, 1.8);
    // Cozinha
    caixa(rc, 8.9, 14.45, 0.26, 0.86, zr, zr + 0.9, MAT.bege, "Bancada da cozinha");
    caixa(rc, 8.9, 14.45, 0.26, 0.88, zr + 0.9, zr + 0.94, MAT.branco);
    caixa(rc, 8.9, 9.6, 0.26, 0.86, zr, zr + 2.4, MAT.bege, "Coluna forno");
    caixa(rc, 9.6, 14.45, 0.26, 0.6, zr + 1.55, zr + 2.3, MAT.bege, "Armários altos");
    caixa(rc, 11.1, 12.9, 2.1, 3.0, zr, zr + 0.92, MAT.bege, "Ilha");
    caixa(rc, 11.05, 12.95, 2.05, 3.05, zr + 0.92, zr + 0.96, MAT.verdeagua);
    [11.5, 12.0, 12.5].forEach(x => { cil(rc, x, 3.3, zr, 0.7, 0.2, MAT.branco); });
    // Suite
    F.cama(p1, z1, 2.3, 3.9, 4.75, 6.76, MAT.preto);
    caixa(p1, 1.8, 2.25, 6.3, 6.76, z1, z1 + 0.55, MAT.carvalho); caixa(p1, 3.95, 4.4, 6.3, 6.76, z1, z1 + 0.55, MAT.carvalho);
    F.tapete(p1, z1, 2.6, 3.6, 3.6, 4.6, MAT.cinza);
    caixa(p1, 4.6, 5.25, 2.5, 4.8, z1, z1 + 2.4, MAT.branco, "Roupeiro suite");
    caixa(p1, 1.26, 3.15, 0.26, 0.85, z1, z1 + 2.6, MAT.branco, "Closet");
    // WCs
    [["wc_rc", rc, zr], ["wc_suite", p1, z1], ["wc_p1", p1, z1]].forEach(([id, g, z]) => {
      const d = M.divisoes.find(q => q.id === id);
      caixa(g, d.x0 + 0.1, d.x0 + 1.0, d.y1 - 0.5, d.y1 - 0.05, z + 0.55, z + 0.85, MAT.branco);
      caixa(g, d.x1 - 0.6, d.x1 - 0.05, d.y0 + 0.05, d.y0 + 0.45, z + 0.3, z + 0.7, MAT.branco);
      if (id !== "wc_rc") caixa(g, d.x1 - 1.0, d.x1 - 0.05, d.y1 - 1.0, d.y1 - 0.05, z, z + 0.04, MAT.branco);
    });
    // Quarto rapazes (beliche e secretária dupla)
    F.beliche(p1, z1, 12.4, 14.45, 0.3, 1.25);
    F.tapete(p1, z1, 12.0, 13.6, 1.4, 2.2, MAT.cinzaClaro);
    caixa(p1, 11.0, 14.0, 2.65, 3.2, z1 + 0.72, z1 + 0.76, MAT.carvalho, "Secretária");
    [11.2, 12.4, 13.6].forEach(x => caixa(p1, x, x + 0.4, 2.65, 3.2, z1, z1 + 0.72, MAT.branco));
    caixa(p1, 12.0, 12.9, 3.12, 3.18, z1 + 0.76, z1 + 1.25, MAT.ecra);
    caixa(p1, 10.8, 11.4, 0.3, 1.6, z1, z1 + 2.5, MAT.branco);
    // Quarto raparigas
    F.beliche(p1, z1, 12.4, 14.45, 5.75, 6.7);
    cil(p1, 12.6, 4.9, z1, 0.012, 0.6, MAT.carvalho);
    caixa(p1, 11.0, 14.0, 3.4, 3.95, z1 + 0.72, z1 + 0.76, MAT.carvalho, "Secretária");
    [11.2, 13.6].forEach(x => caixa(p1, x, x + 0.4, 3.4, 3.95, z1, z1 + 0.72, MAT.branco));
    caixa(p1, 10.8, 11.4, 5.0, 6.7, z1, z1 + 2.5, MAT.branco);
    // Garagem, oficina e ginásio
    F.carro(cv, zc, 1.4, 6.15, 4.15, 6.05);
    caixa(cv, 0.8, 1.0, 3.2, 3.6, zc + 1.0, zc + 1.4, MAT.preto, "Carregador Tesla");
    caixa(cv, 6.4, 9.2, 0.3, 1.0, zc, zc + 0.9, MAT.carvalho, "Bancada da oficina");
    caixa(cv, 7.6, 8.1, 0.4, 0.9, zc + 0.9, zc + 1.4, MAT.preto, "Impressora Bambu Lab P2S");
    caixa(cv, 9.4, 10.3, 0.3, 0.8, zc, zc + 1.9, MAT.cinza, "Estante metálica");
    caixa(cv, 10.6, 15.4, 0.3, 6.7, zc, zc + 0.02, MAT.borracha);
    caixa(cv, 13.2, 15.3, 0.4, 1.6, zc, zc + 2.1, MAT.preto, "Estação multifunções");
    caixa(cv, 11.0, 12.6, 0.4, 1.3, zc, zc + 1.2, MAT.preto, "Leg press");
    caixa(cv, 11.2, 12.2, 5.6, 6.5, zc, zc + 1.2, MAT.preto, "Bicicleta");
    caixa(cv, 13.0, 15.2, 4.8, 6.7, zc, zc + 0.05, MAT.verdeagua, "Tatami");
    caixa(cv, 15.4, 15.46, 2.0, 4.6, zc + 0.2, zc + 2.2, MAT.vidroCarro, "Espelhos");
    // Casa das máquinas: inversor, baterias, AQS e máquinas
    caixa(cv, 0.76, 1.3, 0.3, 1.0, zc + 1.0, zc + 1.7, MAT.branco, "Inversor Deye");
    for (let i = 0; i < 4; i++) caixa(cv, 1.5, 2.1, 0.3, 0.75, zc + i * 0.22, zc + i * 0.22 + 0.2, MAT.cinzaClaro, "Bateria Felicity " + (i + 1));
    cil(cv, 3.5, 0.75, zc, 1.8, 0.33, MAT.branco).name = "AQS Baxi";
    caixa(cv, 2.5, 3.1, 2.3, 2.9, zc, zc + 0.85, MAT.branco, "Máquina de lavar");
    caixa(cv, 2.5, 3.1, 2.3, 2.9, zc + 0.85, zc + 1.7, MAT.branco, "Máquina de secar");

    // ---------- Telhado (duas águas, empenas em ripa) com 9 painéis no pano sul ----------
    { const c = M.contorno.p1, ze = zP.p1 + hP.p1 + 0.25, ym = (c.y0 + c.y1) / 2, alt = 2.2, ov = 0.15, g = grupos.telhado;
      const meia = (c.y1 - c.y0) / 2 + ov, L = Math.hypot(meia, alt), ang = Math.atan2(alt, meia), comp = c.x1 - c.x0 + 1.0, xm = (c.x0 + c.x1) / 2 - 0.4;
      caixa(g, c.x0, c.x1, c.y0, c.y1, ze - 0.25, ze, MAT.laje);
      [-1, 1].forEach(s => {
        const pano = new THREE.Mesh(new THREE.BoxGeometry(comp, 0.1, L), MAT.telha);
        pano.position.set(xm, ze + alt / 2, ym + s * meia / 2); pano.rotation.x = s * ang;
        pano.castShadow = true; pano.receiveShadow = true; g.add(pano);
      });
      [c.x0, c.x1].forEach(xw => {
        const sh = new THREE.Shape(); sh.moveTo(-meia, 0); sh.lineTo(meia, 0); sh.lineTo(0, alt); sh.lineTo(-meia, 0);
        const emp = new THREE.Mesh(new THREE.ExtrudeGeometry(sh, { depth: 0.2, bevelEnabled: false }), MAT.madeiraFachada);
        emp.rotation.y = -Math.PI / 2; emp.position.set(xw + 0.1, ze, ym); emp.castShadow = true; g.add(emp);
      });
      const pw = 1.134, pl = 2.278, n = 9, x0 = xm - (n * (pw + 0.03)) / 2, t = 0.5;
      for (let i = 0; i < n; i++) {
        const pv = new THREE.Mesh(new THREE.BoxGeometry(pw, 0.04, pl), MAT.pv);
        pv.position.set(x0 + i * (pw + 0.03) + pw / 2, ze + alt * (1 - t) + 0.09, ym + meia * t);
        pv.rotation.x = ang; pv.castShadow = true; pv.name = "Painel solar " + (i + 1); g.add(pv);
      }
    }

    // Âncoras para os fluxos de energia (coordenadas three)
    const ancoras = {
      sol: new THREE.Vector3(7.4, 7.2, 5.2),
      casa: new THREE.Vector3(7.5, 1.4, 4.6),
      bateria: new THREE.Vector3(1.8, -2.4, 0.55),
      rede: new THREE.Vector3(-8.2, 2.5, -1.0),
      carro: new THREE.Vector3(3.8, -2.0, 5.1),
      piscina: new THREE.Vector3(20.3, 0.3, 3.5)
    };
    return { root, grupos, paredes, pickables, roomByMesh, luzes, MAT, agua, ancoras, zP, hP };
  }
  if (typeof module !== "undefined" && module.exports) module.exports = { construirCasa };
  else raiz.construirCasa = construirCasa;
})(typeof window !== "undefined" ? window : globalThis);
