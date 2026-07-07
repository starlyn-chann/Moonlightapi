import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpeta = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        if (!fs.existsSync(carpeta)) {
            return res.status(404).send('Carpeta no encontrada: api/nsfw/pene');
        }

        // Leer todos los archivos
        const archivos = fs.readdirSync(carpeta);

        // Filtro más flexible: cualquier archivo que termine en .jpg, .jpeg o .mp4
        const mediaFiles = archivos.filter(archivo => {
            const nombreLower = archivo.toLowerCase();
            return nombreLower.endsWith('.jpg') || 
                   nombreLower.endsWith('.jpeg') || 
                   nombreLower.endsWith('.mp4');
        });

        if (mediaFiles.length === 0) {
            return res.status(404).send(`No se encontraron archivos .jpg o .mp4 en la carpeta.\nArchivos encontrados: ${archivos.join(', ')}`);
        }

        // Seleccionar uno aleatorio
        const archivoAleatorio = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const rutaArchivo = path.join(carpeta, archivoAleatorio);

        // Leer archivo
        const archivoBuffer = fs.readFileSync(rutaArchivo);

        // Determinar tipo MIME
        const ext = path.extname(archivoAleatorio).toLowerCase();
        let contentType = 'application/octet-stream';
        
        if (ext === '.jpg' || ext === '.jpeg') {
            contentType = 'image/jpeg';
        } else if (ext === '.mp4') {
            contentType = 'video/mp4';
        }

        // Headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', archivoBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        
        // Nombre del archivo en header (útil para debugging)
        res.setHeader('X-File-Name', archivoAleatorio);

        return res.status(200).send(archivoBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
}