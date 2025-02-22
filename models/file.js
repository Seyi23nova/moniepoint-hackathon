import mongoose from 'mongoose'

const fileSchema = mongoose.Schema({
    originalName: { type: String, required: false },
    content: { type: String, required: false },
    mimetype: { type: String, required: false },
    timestamp: { type: Date, required: false },
    month: { type: Date, required: false },
    year: { type: Date, required: false }
})

export default mongoose.model("File", fileSchema)