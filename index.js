import express from 'express'
import csrf from 'csurf'
import cookieParser from 'cookie-parser'
import usuarioRoutes from './routes/usuarioRoutes.js'
import propiedadesRoutes from './routes/propiedadesRoutes.js'
import appRoutes from './routes/appRoutes.js'
import apiRoutes from './routes/apiRoutes.js'


import db from './config/db.js'

const app = express()

// HABILITAR LECTURA DE DATOS DE FORMULARIOS
app.use(express.urlencoded({extended:true}))


// habilitar cookie parser
app.use(cookieParser())

// habilitar CSRF
app.use(csrf({cookie:true}))

// conexion a la base de datos

try {
    await db.authenticate();
    db.sync()
    console.log('conexion correcta a la base de datos');
} catch (error) {
    console.log(error);
}

// routing
app.use('/', appRoutes)
app.use('/auth',usuarioRoutes)
app.use('/', propiedadesRoutes)
app.use('/api', apiRoutes)

// habilitar pug
app.set('view engine','pug')
app.set('views','./views')

// carpeta publica
app.use(express.static('public'))

//definir puerto y arrancar el proyecto
const port = process.env.PORT || 3000;
app.listen(port, ()=>{
    console.log(`el servidor esta funcionando en el puerto ${port}`);
})