// THIS CONTROLLER HANDLES THE UPLOADED TEXT FILE AND STORES IT IN A MONGO-DB DATABASE
import mongoose from 'mongoose';
import fs from 'fs';
import File from '../models/file.js';


export const uploadFile = async (req, res) => {

    try {
        if (!req.file) {
            return res.status(400).json({ error: 'There was no file uploaded' })
        }

        const {path, originalname, mimetype} = req.file

        fs.readFile(path, isUtf8, async(error, data) => {
            if (err){
                return res.status(500).json({error: 'There was an error reading the file'})
            }

            const fileDoc = new File({
                originalName: originalname,
                content: data,
                mimetype: mimetype,
                timeStamp: new Date().toISOString(),
                month: new Date().toISOString().substring(5, 7),
                year: new Date().toISOString().substring(0, 4)
            })
    
            await fileDoc.save()

            res.status(200).json({
                message: 'File has been uploaded successfully',
                fileId: fileDoc._id
            })
        })
    } catch(error){
        res.status(500).json({error: 'There was an error saving file to database'})
    }
}