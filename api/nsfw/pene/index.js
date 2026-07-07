import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpeta = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        if (!fs.existsSync(carpeta)) {
            return res.status(404).send('Carpeta no encontrada');
        }

        const imagenes = [];
        const videos = [];

        // Buscar fotos: foto1.jpg → foto34.jpg
        for (let i = 1; i <= 34; i++) {
            const nombre = `foto${i}.jpg`;
            if (fs.existsSync(path.join(carpeta, nombre))) {
                imagenes.push(nombre);
            }
        }

        // Buscar videos: vídeo1.mp4 → vídeo30.mp4 (con tilde)
        for (let i = 1; i <= 30; i++) {
            const nombre = `vídeo${i}.mp4`;
            if (fs.existsSync(path.join(carpeta, nombre))) {
                videos.push(nombre);
            }
        }

        // Combinar todos los archivos encontrados
        const todosLosArchivos = [...imagenes, ...videos];

        if (todosLosArchivos.length === 0) {
            return res.status(404).send(
                'No se encontraron archivos.\n' +
                `Fotos encontradas: ${imagenes.length}/34\n` +
                `Videos encontrados: ${videos.length}/30`
            );
        }

        // Seleccionar uno aleatorio
        const archivoAleatorio = todosLosArchivos[Math.floor(Math.random() * todosLosArchivos.length)];
        const rutaArchivo = path.join(carpeta, archivoAleatorio);

        const archivoBuffer = fs.readFileSync(rutaArchivo);

        // Tipo de contenido
        const esVideo = archivoAleatorio.toLowerCase().includes('.mp4');
        const contentType = esVideo ? 'video/mp4' : 'image/jpeg';

        // Headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', archivoBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-File-Name', archivoAleatorio);

        return res.status(200).send(archivoBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
}