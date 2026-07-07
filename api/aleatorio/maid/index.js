import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        // Busca el archivo maid.json que está en su misma carpeta
        const rutaJson = path.join(process.cwd(), 'api', 'aleatorio', 'maid', 'maid.json');

        if (!fs.existsSync(rutaJson)) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(404).send(JSON.stringify({ status: false, error: "Falta maid.json" }, null, 2));
        }

        // Lee el archivo json de al lado
        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        const linksArray = JSON.parse(contenidoRaw);

        if (!linksArray || linksArray.length === 0) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.status(400).send(JSON.stringify({ status: false, error: "maid.json vacío" }, null, 2));
        }

        // Selecciona un link al azar de Maid
        const linkAleatorio = linksArray[Math.floor(Math.random() * linksArray.length)];

        // DETECCIÓN AUTOMÁTICA: ¿Es foto o es video de anime?
        const esVideo = linkAleatorio.toLowerCase().endsWith('.mp4');

        const urlImagen = esVideo ? "null" : linkAleatorio;
        const urlVideo = esVideo ? linkAleatorio : "null";
        const tipoMime = esVideo ? "video/mp4" : "image/jpeg";

        // Estructura del objeto final ordenada con tu firma (Idéntica a Shinobu)
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
                        category: "Anime",
                        type: tipoMime
                    }
                ]
            }
        };

        // CONFIGURACIÓN DE CABECERAS (Forzamos JSON ordenado)
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*'); 

        // Enviamos el JSON formateado con los 2 espacios de separación para que no salga feo
        const jsonBonito = JSON.stringify(respuestaApi, null, 2);
        return res.status(200).send(jsonBonito);

    } catch (error) {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.status(500).send(JSON.stringify({ status: false, error: "Error interno en la API de Maid" }, null, 2));
    }
}
