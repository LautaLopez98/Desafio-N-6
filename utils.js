import {fileURLToPath} from 'url';
import { dirname } from 'path';
import path from 'path';
import multer from 'multer';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);



export default __dirname;

    
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./src/public/uploads")
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() +"-"+ file.originalname )
    }
})

export const upload = multer({ storage: storage })