// Convertir letras a números (A = 0, ..., Z = 25)
function textoANumeros(texto) {
  return texto.toUpperCase().replace(/[^A-Z]/g, '').split('').map(c => c.charCodeAt(0) - 65);
}

// Convertir números a texto (0 = A, ..., 25 = Z)
function numerosATexto(numeros) {
  return numeros.map(n => String.fromCharCode((n % 26 + 26) % 26 + 65)).join('');
}

// Parsear la matriz clave desde el textarea
function parsearMatriz(texto, tamaño) {
  const filas = texto.trim().split('\n').map(f => f.split(',').map(Number));
  if (filas.length !== tamaño || filas.some(f => f.length !== tamaño)) {
    throw new Error("La matriz no tiene el tamaño correcto");
  }
  return math.matrix(filas);
}

// Cifrado de Hill
function cifrarHill() {
  try {
    const texto = document.getElementById("textoPlano").value;
    const tamaño = parseInt(document.getElementById("tamBloque").value);
    const matrizTexto = document.getElementById("matrizClave").value;

    const matriz = parsearMatriz(matrizTexto, tamaño);
    const numeros = textoANumeros(texto);

    while (numeros.length % tamaño !== 0) {
      numeros.push(88); // Rellenar con 'X'
    }

    const resultado = [];
    for (let i = 0; i < numeros.length; i += tamaño) {
      const bloque = math.matrix(numeros.slice(i, i + tamaño));
      const producto = math.multiply(matriz, bloque);
      const mod = producto.toArray().map(n => ((n % 26) + 26) % 26);
      resultado.push(...mod);
    }

    document.getElementById("resultadoCifrado").textContent = numerosATexto(resultado);
  } catch (error) {
    alert("Error al cifrar: " + error.message);
  }
}

// Cálculo del inverso módulo 26 de una matriz
function matrizInversaMod26(matriz) {
  const det = Math.round(math.det(matriz));
  const detMod = ((det % 26) + 26) % 26;

  let invDet = null;
  for (let i = 1; i < 26; i++) {
    if ((detMod * i) % 26 === 1) {
      invDet = i;
      break;
    }
  }

  if (invDet === null) throw new Error("La matriz no tiene inversa módulo 26");

  const adj = math.round(math.multiply(math.inv(matriz), det));
  const inv = math.multiply(invDet, adj);

  return math.mod(inv, 26);
}

// Descifrado de Hill
function desencriptarHill() {
  try {
    const texto = document.getElementById("textoCifrado").value;
    const tamaño = parseInt(document.getElementById("tamBloqueDesc").value);
    const matrizTexto = document.getElementById("matrizClaveDesc").value;

    const matriz = parsearMatriz(matrizTexto, tamaño);
    const inversa = matrizInversaMod26(matriz);
    const numeros = textoANumeros(texto);

    if (numeros.length % tamaño !== 0) {
      throw new Error("El texto cifrado no es múltiplo del tamaño del bloque");
    }

    const resultado = [];
    for (let i = 0; i < numeros.length; i += tamaño) {
      const bloque = math.matrix(numeros.slice(i, i + tamaño));
      const producto = math.multiply(inversa, bloque);
      const mod = producto.toArray().map(n => ((Math.round(n) % 26) + 26) % 26);
      resultado.push(...mod);
    }

    document.getElementById("resultadoDescifrado").textContent = numerosATexto(resultado);
  } catch (error) {
    alert("Error al desencriptar: " + error.message);
  }
}













