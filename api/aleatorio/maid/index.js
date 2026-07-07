import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  try {
    // Ruta hacia el archivo maid.json en la raíz del proyecto
    const filePath = path.join(process.cwd(), 'maid.json');
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        status: false,
        author: "StarLyn",
        message: "El archivo base maid.json no fue encontrado en la raíz."
      });
    }

    // Leer y parsear los enlaces
    const fileData = fs.readFileSync(filePath, 'utf-8');
    const links = JSON.parse(fileData);

    if (!Array.isArray(links) || links.length === 0) {
      return res.status(500).json({
        status: false,
        author: "StarLyn",
        message: "La base de datos de Maid está vacía o mal estructurada."
      });
    }

    // Seleccionar enlace aleatorio
    const randomLink = links[Math.floor(Math.random() * links.length)];
    const esVideo = randomLink.toLowerCase().endsWith('.mp4');
    const mime = esVideo ? 'video/mp4' : (randomLink.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

    // CONFIGURACIÓN DE CABECERAS (Evita el almacenamiento en caché de Vercel)
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Access-Control-Allow-Origin', '*');

    // RETORNO ESTRUCTURADO (Orden exacto igual al de Shinobu)
    return res.status(200).json({
      status: true,
      Author: "StarLyn",
      result: {
        status: true,
        title: "Moonlight Staff API",
        url: randomLink,
        category: "Anime",
        type: mime
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: false,
      author: "StarLyn",
      message: "Error interno en el motor de Moonlight.",
      error: error.message
    });
  }
}
