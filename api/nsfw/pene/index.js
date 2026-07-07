import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpetaImagenes = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        // Verificar carpeta
        if (!fs.existsSync(carpetaImagenes)) {
            return res.status(404).send('Carpeta de imágenes no encontrada');
        }

        // Buscar imágenes foto1.jpg hasta foto34.jpg
        const imagenesDisponibles = [];
        for (let i = 1; i <= 34; i++) {
            const archivo = `foto${i}.jpg`;
            if (fs.existsSync(path.join(carpetaImagenes, archivo))) {
                imagenesDisponibles.push(archivo);
            }
        }

        if (imagenesDisponibles.length === 0) {
            return res.status(404).send('No se encontraron imágenes foto1.jpg a foto34.jpg');
        }

        // Seleccionar imagen aleatoria
        const imagenAleatoria = imagenesDisponibles[Math.floor(Math.random() * imagenesDisponibles.length)];
        const rutaImagen = path.join(carpetaImagenes, imagenAleatoria);

        // Leer la imagen
        const imagenBuffer = fs.readFileSync(rutaImagen);

        // Configurar headers para imagen
        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', imagenBuffer.length);
        res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache de 1 hora
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Enviar la imagen directamente
        return res.status(200).send(imagenBuffer);

    } catch (error) {
        console.error(error);
        return res.status(500).send('Error interno del servidor');
    }
}