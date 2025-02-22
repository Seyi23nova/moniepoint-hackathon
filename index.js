import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import multer from 'multer'
import uploadRoute from './routes/upload'
import transactionDataRoute from './routes/transactionData'

const app = express();

const upload = multer({ dest: "uploads/" });
app.use(cors());

dotenv.config();


app.use('/', uploadRoute)
app.use('/metrics', transactionDataRoute)

const CONNECTION_URL = "" // will be an environment variable in production
const PORT = "" //will be an environment variable in production


mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
     .then(() => {
          const server = app.listen(PORT, () => {
              console.log(`server is running on port ${PORT}`)
          })

          return server
     }
)
.catch((error) => console.log(error.message))
