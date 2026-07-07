import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const rutaJson = path.join(process.cwd(), 'api', 'aleatorio', 'maid', 'maid.json');

        if (!fs.existsSync(rutaJson)) {
            return res.status(404).json({ status: false, error: "Falta maid.json" });
        }

        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        let linksArray = JSON.parse(contenidoRaw);

        if (!Array.isArray(linksArray) || linksArray.length === 0) {
            return res.status(400).json({ status: false, error: "maid.json vacío o inválido" });
        }

        // Selección aleatoria
        const randomIndex = Math.floor(Math.random() * linksArray.length);
        const linkAleatorio = linksArray[randomIndex];

        // Fetch desde Catbox
        const response = await fetch(linkAleatorio, { cache: 'no-store' });

        if (!response.ok) {
            return res.status(502).json({ status: false, error: "Error al cargar el archivo" });
        }

        // Tipo de contenido
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

        // === ANTI-CACHÉ FUERTE ===
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Surrogate-Control', 'no-store');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const buffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error('Error en API Maid:', error);
        return res.status(500).json({ status: false, error: "Error interno del servidor" });
    }
}