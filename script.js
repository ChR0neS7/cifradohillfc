function letraANum(c) {
  return c.charCodeAt(0) - 'A'.charCodeAt(0);
}

function numALetra(n) {
  return String.fromCharCode((n % 26) + 'A'.charCodeAt(0));
}

function esInvertibleMod26(matrix) {
  const n = matrix.length;
  let det;
  if (n === 2) {
    det = matrix[0][0]*matrix[1][1] - matrix[0][1]*matrix[1][0];
  } else if (n === 3) {
    det = (
      matrix[0][0]*(matrix[1][1]*matrix[2][2] - matrix[1][2]*matrix[2][1]) -
      matrix[0][1]*(matrix[1][0]*matrix[2][2] - matrix[1][2]*matrix[2][0]) +
      matrix[0][2]*(matrix[1][0]*matrix[2][1] - matrix[1][1]*matrix[2][0])
    );
  }
  det = ((det % 26) + 26) % 26;
  return gcd(det, 26) === 1;
}

function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}

function preprocesarTexto(texto, n) {
  texto = texto.toUpperCase().replace(/[^A-Z]/g, '');
  while (texto.length % n !== 0) {
    texto += 'X';
  }
  return texto;
}

function multiplicarMatriz(matriz, vector) {
  const resultado = [];
  for (let i = 0; i < matriz.length; i++) {
    let suma = 0;
    for (let j = 0; j < vector.length; j++) {
      suma += matriz[i][j] * vector[j];
    }
    resultado.push(suma % 26);
  }
  return resultado;
}

function encriptarHill(texto, matriz, n) {
  texto = preprocesarTexto(texto, n);
  let cifrado = '';
  for (let i = 0; i < texto.length; i += n) {
    const bloque = texto.slice(i, i + n).split('').map(letraANum);
    const cifradoBloque = multiplicarMatriz(matriz, bloque).map(numALetra).join('');
    cifrado += cifradoBloque;
  }
  return cifrado;
}

document.getElementById("hillForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const texto = document.getElementById("textoPlano").value;
  const n = parseInt(document.getElementById("tamBloque").value);
  const matrizTexto = document.getElementById("matrizClave").value.trim();

  const filas = matrizTexto.split('\n').map(f => f.split(',').map(x => parseInt(x.trim())));
  if (filas.length !== n || filas.some(fila => fila.length !== n)) {
    alert("La matriz debe ser de tamaño " + n + "x" + n);
    return;
  }

  if (!esInvertibleMod26(filas)) {
    alert("La matriz no es invertible módulo 26");
    return;
  }

  const resultado = encriptarHill(texto, filas, n);
  document.getElementById("resultado").textContent = resultado;
});
