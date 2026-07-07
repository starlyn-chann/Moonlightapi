import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        // Ruta al archivo shinobu.json
        const rutaJson = path.join(process.cwd(), 'api', 'aleatorio', 'shinobu', 'shinobu.json');

        if (!fs.existsSync(rutaJson)) {
            return res.status(404).json({ status: false, error: "Falta shinobu.json" });
        }

        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        let linksArray = JSON.parse(contenidoRaw);

        if (!Array.isArray(linksArray) || linksArray.length === 0) {
            return res.status(400).json({ status: false, error: "shinobu.json vacío o inválido" });
        }

        // Selecciona un link aleatorio
        const randomIndex = Math.floor(Math.random() * linksArray.length);
        const linkAleatorio = linksArray[randomIndex];

        // Obtener el archivo desde Catbox
        const response = await fetch(linkAleatorio, { cache: 'no-store' });

        if (!response.ok) {
            return res.status(502).json({ status: false, error: "Error al obtener el archivo de Catbox" });
        }

        // Detectar tipo de contenido
        const esVideo = linkAleatorio.toLowerCase().endsWith('.mp4');
        const ext = path.extname(linkAleatorio).toLowerCase();

        if (esVideo) {
            res.setHeader('Content-Type', 'video/mp4');
        } else if (ext === '.png') {
            res.setHeader('Content-Type', 'image/png');
        } else if (ext === '.webp') {
            res.setHeader('Content-Type', 'image/webp');
        } else if (ext === '.gif') {
            res.setHeader('Content-Type', 'image/gif');
        } else {
            res.setHeader('Content-Type', 'image/jpeg');
        }

        // Anti-caché fuerte (para que siempre muestre una imagen diferente)
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Enviar la imagen/video directamente
        const buffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error('Error en API Shinobu:', error);
        return res.status(500).json({ status: false, error: "Error interno en la API de Shinobu" });
    }
}