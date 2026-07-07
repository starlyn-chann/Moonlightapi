import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpeta = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        if (!fs.existsSync(carpeta)) {
            return res.status(404).send('Carpeta no encontrada');
        }

        // Leer todos los archivos de la carpeta
        const archivos = fs.readdirSync(carpeta);

        // Filtrar solo imágenes y videos
        const mediaFiles = archivos.filter(archivo => {
            const ext = path.extname(archivo).toLowerCase();
            return ext === '.jpg' || ext === '.jpeg' || ext === '.mp4';
        });

        if (mediaFiles.length === 0) {
            return res.status(404).send('No se encontraron imágenes (.jpg) ni videos (.mp4)');
        }

        // Seleccionar archivo aleatorio
        const archivoAleatorio = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const rutaArchivo = path.join(carpeta, archivoAleatorio);

        // Leer el archivo
        const archivoBuffer = fs.readFileSync(rutaArchivo);

        // Determinar tipo MIME
        const extension = path.extname(archivoAleatorio).toLowerCase();
        let contentType = 'application/octet-stream';

        if (extension === '.jpg' || extension === '.jpeg') {
            contentType = 'image/jpeg';
        } else if (extension === '.mp4') {
            contentType = 'video/mp4';
        }

        // Headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', archivoBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Enviar el archivo directamente (imagen o video)
        return res.status(200).send(archivoBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
}