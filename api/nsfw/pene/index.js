import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpeta = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        if (!fs.existsSync(carpeta)) {
            return res.status(404).send('❌ Carpeta no encontrada: api/nsfw/pene');
        }

        // Leer todos los archivos de la carpeta
        const archivos = fs.readdirSync(carpeta);

        // Filtro muy flexible: cualquier archivo que termine en .jpg/.jpeg/.mp4
        const mediaFiles = archivos.filter(archivo => {
            const nombre = archivo.toLowerCase().trim();
            return nombre.endsWith('.jpg') || 
                   nombre.endsWith('.jpeg') || 
                   nombre.endsWith('.mp4');
        });

        if (mediaFiles.length === 0) {
            let mensaje = '❌ No se encontraron archivos .jpg o .mp4\n\n';
            mensaje += `Archivos encontrados en la carpeta (${archivos.length}):\n`;
            mensaje += archivos.length > 0 ? archivos.join('\n') : 'Ninguno';
            return res.status(404).send(mensaje);
        }

        // Seleccionar uno aleatorio
        const archivoAleatorio = mediaFiles[Math.floor(Math.random() * mediaFiles.length)];
        const rutaArchivo = path.join(carpeta, archivoAleatorio);

        // Leer el archivo
        const archivoBuffer = fs.readFileSync(rutaArchivo);

        // Tipo MIME
        const ext = path.extname(archivoAleatorio).toLowerCase();
        const contentType = ext === '.mp4' ? 'video/mp4' : 'image/jpeg';

        // Headers
        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Length', archivoBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('X-File-Name', archivoAleatorio);   // Para saber cuál se sirvió

        return res.status(200).send(archivoBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('❌ Error interno del servidor');
    }
}