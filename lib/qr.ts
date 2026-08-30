import QRCode from "qrcode";

const QR_SIZE = 1000;
const MARGIN = 60; // zona de silencio alrededor del QR, donde cabe la etiqueta

/**
 * Genera el SVG del QR con un identificador pequeño y discreto en la
 * esquina inferior derecha (dentro de la zona de silencio del propio
 * código), suficiente para que el taller distinga cada pieza física sin
 * que se note como un elemento gráfico separado del diseño.
 */
export async function buildLabeledQrSvg(id: string, targetUrl: string) {
  const rawQr = await QRCode.toString(targetUrl, {
    type: "svg",
    errorCorrectionLevel: "H",
    margin: 1,
    width: QR_SIZE,
  });

  // El SVG crudo ya trae sus propios atributos width/height (fijados por
  // la opción `width` de arriba); hay que quitarlos antes de imponer los
  // nuestros junto con x/y, o el XML queda con atributos duplicados.
  const nestedQr = rawQr
    .replace(/\swidth="[^"]*"/, "")
    .replace(/\sheight="[^"]*"/, "")
    .replace(
      "<svg",
      `<svg x="${MARGIN}" y="${MARGIN}" width="${QR_SIZE}" height="${QR_SIZE}"`
    );

  const totalSize = QR_SIZE + MARGIN * 2;
  const shortCode = shortLabel(id);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}">
  <rect width="100%" height="100%" fill="#ffffff"/>
  ${nestedQr}
  <text
    x="${totalSize - 12}"
    y="${totalSize - 14}"
    text-anchor="end"
    font-family="Helvetica, Arial, sans-serif"
    font-weight="500"
    font-size="26"
    letter-spacing="0.5"
    fill="#B8BFCC"
  >${escapeXml(shortCode)}</text>
</svg>`;
}

/**
 * Reduce "stand_001" -> "001". Si el ID no trae un número al final,
 * se usa el ID completo tal cual (sigue siendo discreto por el tamaño
 * de fuente pequeño y el color gris claro).
 */
function shortLabel(id: string) {
  const match = id.match(/(\d+)\s*$/);
  return match ? match[1] : id;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
