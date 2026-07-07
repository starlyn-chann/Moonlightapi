import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    try {
        // Busca el archivo pene.json que está en su misma carpeta
        const rutaJson = path.join(process.cwd(), 'api', 'nsfw', 'pene', 'pene.json');

        if (!fs.existsSync(rutaJson)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(404).json({ 
                status: false, 
                error: "El archivo pene.json no está en esta carpeta" 
            });
        }

        // Lee el archivo json de al lado
        const contenidoRaw = fs.readFileSync(rutaJson, 'utf8');
        const linksArray = JSON.parse(contenidoRaw);

        if (!linksArray || linksArray.length === 0) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(400).json({ status: false, error: "El archivo pene.json está vacío" });
        }

        // Selecciona el link aleatorio de Catbox
        const linkAleatorio = linksArray[Math.floor(Math.random() * linksArray.length)];

        // Configuramos las cabeceras reales de una API para curl y tu bot
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*'); 

        // Entregamos el JSON crudo real
        return res.status(200).json({
            status: true,
            Author: "StarLyn",
            result: {
                status: true,
                data: [
                    {
                        title: "Moonlight Staff API",
                        image: linkAleatorio,
                        video: "null",
                        category: "NSFW",
                        type: "image/jpeg"
                    }
                ]
            }
        });

    } catch (error) {
        res.setHeader('Content-Type', 'application/json');
        return res.status(500).json({ 
            status: false, 
            error: "Error en el servidor de la API",
            detalle: error.message 
        });
    }
}
