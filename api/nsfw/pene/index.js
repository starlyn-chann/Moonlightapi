import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpeta = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        if (!fs.existsSync(carpeta)) {
            return res.status(404).send('Carpeta no encontrada');
        }

        const mediaFiles = [];

        // Fotos: foto1.jpg hasta foto34.jpg
        for (let i = 1; i <= 34; i++) {
            const foto = `foto${i}.jpg`;
            if (fs.existsSync(path.join(carpeta, foto))) {
                mediaFiles.push(foto);
            }
        }

        // Videos: vídeo1.mp4 hasta vídeo30.mp4
        for (let i = 1; i <= 30; i++) {
            const video = `vídeo${i}.mp4`;
            if (fs.existsSync(path.join(carpeta, video))) {
                mediaFiles.push(video);
            }
        }

        if (mediaFiles.length === 0) {
            return res.status(404).send('No se encontraron fotos ni vídeos');
        }

        // Seleccionar uno aleatorio
        const archivoAleatorio = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const rutaArchivo = path.join(carpeta, archivoAleatorio);

        const buffer = fs.readFileSync(rutaArchivo);

        // Configurar tipo correcto
        const contentType = archivoAleatorio.endsWith('.mp4') ? 'video/mp4' : 'image/jpeg';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', buffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-File-Name', archivoAleatorio);

        return res.status(200).send(buffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno');
    }
}