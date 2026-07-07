import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Solo permitimos peticiones GET en Moonlight
  if (req.method !== 'GET') {
    return res.status(405).json({
      status: false,
      message: 'Método no permitido. Utiliza GET.'
    });
  }

  try {
    // Apuntamos al archivo maid.json en la raíz del proyecto
    const jsonPath = path.join(process.cwd(), 'maid.json');
    
    if (!fs.existsSync(jsonPath)) {
      return res.status(404).json({
        status: false,
        author: 'StarLyn',
        message: 'El archivo maid.json no fue encontrado en la raíz.'
      });
    }

    // Leemos el archivo local y lo convertimos en Array
    const rawData = fs.readFileSync(jsonPath, 'utf-8');
    const links = JSON.parse(rawData);

    if (!Array.isArray(links) || links.length === 0) {
      return res.status(500).json({
        status: false,
        author: 'StarLyn',
        message: 'La base de datos de Maid está vacía o mal estructurada.'
      });
    }

    // Seleccionamos un enlace aleatorio del array
    const enlaceAleatorio = links[Math.floor(Math.random() * links.length)];
    
    // Identificamos dinámicamente si es video (.mp4) o imagen (.png, .jpg, etc.)
    const esVideo = enlaceAleatorio.toLowerCase().endsWith('.mp4');
    const mimeType = esVideo ? 'video/mp4' : (enlaceAleatorio.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');

    // Estructura de respuesta global de tu ecosistema Moonlight Staff API
    const responseStructure = {
      status: true,
      Author: "StarLyn",
      result: {
        status: true,
        data: [
          {
            title: "Moonlight Staff API",
            image: esVideo ? "null" : enlaceAleatorio,
            video: esVideo ? enlaceAleatorio : "null",
            category: "Anime",
            type: mimeType
          }
        ]
      }
    };

    // Configuramos cabeceras de caché rápidas para evitar que Vercel congele la misma imagen
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    // Enviamos el JSON final
    return res.status(200).json(responseStructure);

  } catch (error) {
    return res.status(500).json({
      status: false,
      author: 'StarLyn',
      message: 'Error interno en el motor de Moonlight.',
      error: error.message
    });
  }
}
