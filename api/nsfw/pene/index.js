import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        const carpetaImagenes = path.join(process.cwd(), 'api', 'nsfw', 'pene');

        // Verificar que la carpeta existe
        if (!fs.existsSync(carpetaImagenes)) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(404).send(JSON.stringify({ 
                status: false, 
                error: "Carpeta de imágenes no encontrada" 
            }, null, 2));
        }

        // Generar array con las 34 imágenes
        const imagenes = [];
        for (let i = 1; i <= 34; i++) {
            const nombreArchivo = `foto${i}.jpg`;
            const rutaArchivo = path.join(carpetaImagenes, nombreArchivo);
            
            if (fs.existsSync(rutaArchivo)) {
                imagenes.push(nombreArchivo);
            }
        }

        if (imagenes.length === 0) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(404).send(JSON.stringify({ 
                status: false, 
                error: "No se encontraron imágenes (foto1.jpg a foto34.jpg)" 
            }, null, 2));
        }

        // Seleccionar imagen aleatoria
        const imagenAleatoria = imagenes[Math.floor(Math.random() * imagenes.length)];
        
        // URL pública (ajusta según tu estructura)
        const urlImagen = `/api/nsfw/pene/${imagenAleatoria}`;

        // Estructura de respuesta
        const respuestaApi = {
            status: true,
            Author: "StarLyn",
            result: {
                status: true,
                data: [
                    {
                        title: "Moonlight Staff API",
                        image: urlImagen,
                        video: "null",
                        category: "NSFW",
                        type: "image/jpeg"
                    }
                ]
            }
        };

        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');

        const jsonBonito = JSON.stringify(respuestaApi, null, 2);
        return res.status(200).send(jsonBonito);

    } catch (error) {
        console.error(error);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(500).send(JSON.stringify({ 
            status: false, 
            error: "Error interno del servidor" 
        }, null, 2));
    }
}