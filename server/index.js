import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import swaggerUi from 'swagger-ui-express';

import * as Validation from './validation.js';
import { UserController, PostController } from "./controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import swaggerOptions from "./openai.json" assert { type: "json" };

const PORT = 4444;

mongoose.connect('mongodb+srv://root:pass@cluster0.ayrogu6.mongodb.net/blog?retryWrites=true&w=majority')
    .then(() => console.log('DB OK'))
    .catch((err) => console.log('DB Error: ', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
})

const upload = multer({ storage });

app.use(express.json())
app.use('/uploads', express.static('uploads'));


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerOptions))



app.get('/auth/me', checkAuth, UserController.getMe)

app.post('/auth/login', Validation.loginValidation, handleValidationErrors, UserController.login)

app.post('/auth/register', Validation.registerValidation, handleValidationErrors, UserController.register)


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})


app.get('/posts', PostController.getAll);

app.get('/posts/:id', PostController.getOne);

app.delete('/posts/:id', checkAuth, PostController.remove);

app.post('/posts', checkAuth, Validation.postCreateValidation, handleValidationErrors, PostController.create)

app.patch('/posts/:id', checkAuth, Validation.postUpdateValidation, handleValidationErrors, PostController.update)




app.listen(PORT, (err) => {
    if (err){
        return console.log("Error: ", err)
    }

    return "Server OK"
})