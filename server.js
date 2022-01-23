import express, { Router, json } from 'express'
import morgan from 'morgan'
import { Contenedor } from './Contenedor.js'

const app = express()

const routerProductos = Router()
routerProductos.use(json())


app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }));
app.use('/api/productos', routerProductos)
app.use(express.static('public'))
app.use('/bootstrap', express.static('./node_modules/bootstrap/dist'))

const PORT = 8080
const server = app.listen(PORT, () => {
    console.log(`servidor escuchando el puerto ${PORT}`)
})
server.on('error', error =>{
    console.log(`error en el servidor ${error}`)
})

const contenedor = new Contenedor('productos.txt')
const productos = await contenedor.getAll()

app.get('/', (req, res) => {
    res.sendFile(__dirname+'index.html')
})

routerProductos.get('/', (req, res) => {
    res.json(productos)
})

routerProductos.get('/:id', (req, res) =>{
    let id = req.params.id
    let prod = productos.find(prod => prod.id == id)
    res.json(prod ? prod: { error : 'producto no encontrado' })
    
})
routerProductos.post('/', (req, res) =>{
    let prod = req.body
    const max = productos.reduce((a,b) => a.id > b.id ? a:b, {id: 0} )
    prod.id = max.id + 1
    productos.push(prod)
    contenedor.save(prod)
    res.json(prod)
})

routerProductos.put('/:id', (req, res) =>{
    let prod = req.body
    let id = req.params.id
    let index = productos.findIndex(prod => prod.id == id)
    if (index >= 0){
        prod.id = id
        productos[index] = prod
        contenedor.updateById(id, prod) 
    }
    res.json(index >=0 ? prod: { error : 'producto no encontrado' })
})

routerProductos.delete('/:id', (req, res) =>{
    let id = req.params.id
    let index = productos.findIndex(prod => prod.id == id)
    let prod = {}
    if (index >= 0){
        prod = productos[index]
        productos.splice(index, 1)
        contenedor.deleteById(id)
    }

    res.json(index >=0 ? prod: { error : 'producto no encontrado' })

})






