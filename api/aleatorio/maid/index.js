import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const rutaJson = path.join(process.cwd(), 'api', 'aleatorio', 'maid', 'maid.json');

        if (!fs.existsSync(rutaJson)) {
            return res.status(404).json({ status: false, error: "Falta maid.json" });
        }

        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        const linksArray = JSON.parse(contenidoRaw);

        if (!linksArray || linksArray.length === 0) {
            return res.status(400).json({ status: false, error: "maid.json vacío" });
        }

        // Selecciona una imagen/video aleatoria
        const linkAleatorio = linksArray[Math.floor(Math.random() * linksArray.length)];

        const response = await fetch(linkAleatorio);
        if (!response.ok) {
            return res.status(502).json({ status: false, error: "Error al obtener el archivo" });
        }

        // Detectar tipo
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

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=7200'); // 2 horas de caché

        const buffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, error: "Error interno" });
    }
}