export function convertirAGlifosAethelgard(num: number|string): { salida: string, success: boolean } {
    if (typeof num === "string") {
      num = parseInt(num, 10);
    }
    
    if (isNaN(num)) {
      return { salida: "ERROR: Entrada no válida.", success: false };
    }

    if (num > 3999) {
      return { salida: "ERROR: Número fuera de rango (1-3999).", success: false };
    }
  
    const glifos = [
      { valor: 1000, glifo: "Ξ" },
      { valor: 900, glifo: "ΦΞ" },
      { valor: 500, glifo: "Ψ" },
      { valor: 400, glifo: "ΦΨ" },
      { valor: 100, glifo: "Φ" },
      { valor: 90, glifo: "ΩΦ" },
      { valor: 50, glifo: "Δ" },
      { valor: 40, glifo: "ΩΔ" },
      { valor: 10, glifo: "Ω" },
      { valor: 9, glifo: "ΣΩ" },
      { valor: 5, glifo: "Λ" },
      { valor: 4, glifo: "ΣΛ" },
      { valor: 1, glifo: "Σ" }
    ];
  
    let resultado = "";
    for (const { valor, glifo } of glifos) {
      while (num >= valor) {
        resultado += glifo;
        num -= valor;
      }
    }
  
    return { salida: resultado, success: true };
  }