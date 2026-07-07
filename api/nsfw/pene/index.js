import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        // Busca el archivo pene.json que está en su misma carpeta
        const rutaJson = path.join(process.cwd(), 'api', 'nsfw', 'pene', 'pene.json');

        if (!fs.existsSync(rutaJson)) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(404).send(JSON.stringify({ status: false, error: "Falta pene.json" }, null, 2));
        }

        // Lee el archivo json de al lado
        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        const linksArray = JSON.parse(contenidoRaw);

        if (!linksArray || linksArray.length === 0) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(400).send(JSON.stringify({ status: false, error: "pene.json vacío" }, null, 2));
        }

        // Selecciona el link aleatorio de Catbox
        const linkAleatorio = linksArray[Math.floor(Math.random() * linksArray.length)];

        // DETECCIÓN AUTOMÁTICA: ¿Es foto o es video?
        const esVideo = linkAleatorio.toLowerCase().endsWith('.mp4');

        const urlImagen = esVideo ? "null" : linkAleatorio;
        const urlVideo = esVideo ? linkAleatorio : "null";
        const tipoMime = esVideo ? "video/mp4" : "image/jpeg";

        // Estructura del objeto final
        const respuestaApi = {
            status: true,
            Author: "StarLyn",
            result: {
                status: true,
                data: [
                    {
                        title: "Moonlight Staff API",
                        image: urlImagen,
                        video: urlVideo,
                        category: "NSFW",
                        type: tipoMime
                    }
                ]
            }
        };

        // CONFIGURACIÓN DE CABECERAS (Forzamos JSON con codificación limpia)
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*'); 

        // EL TRUCO: Enviamos el JSON formateado con 2 espacios de separación
        const jsonBonito = JSON.stringify(respuestaApi, null, 2);
        return res.status(200).send(jsonBonito);

    } catch (error) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(500).send(JSON.stringify({ status: false, error: "Error interno" }, null, 2));
    }
}