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

        // Seleccionar link aleatorio
        const linkAleatorio = linksArray[Math.floor(Math.random() * linksArray.length)];

        // Detectar si es video o imagen
        const esVideo = linkAleatorio.toLowerCase().endsWith('.mp4');

        // Fetch del archivo desde Catbox
        const response = await fetch(linkAleatorio);

        if (!response.ok) {
            return res.status(502).json({ 
                status: false, 
                error: "No se pudo obtener el archivo de Catbox" 
            });
        }

        // Configurar headers según el tipo
        if (esVideo) {
            res.setHeader('Content-Type', 'video/mp4');
            res.setHeader('Content-Disposition', 'inline'); // o 'attachment' si quieres forzar descarga
        } else {
            res.setHeader('Content-Type', 'image/jpeg'); // Catbox suele ser jpeg/webp/png
            // Puedes mejorar la detección según la extensión:
            // const ext = path.extname(linkAleatorio).toLowerCase();
            // if (ext === '.png') res.setHeader('Content-Type', 'image/png');
            // if (ext === '.webp') res.setHeader('Content-Type', 'image/webp');
        }

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Cache-Control', 'public, max-age=3600'); // opcional: caché de 1 hora

        // Enviar el stream directamente
        const buffer = await response.arrayBuffer();
        return res.status(200).send(Buffer.from(buffer));

    } catch (error) {
        console.error(error);
        return res.status(500).json({ 
            status: false, 
            error: "Error interno en la API de Maid" 
        });
    }
}