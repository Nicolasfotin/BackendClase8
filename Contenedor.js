import fs from 'node:fs'

class Contenedor {
    constructor(fileName) {
        this.fileName = fileName
    }

    async save(producto) {
        try {
            let res = 1
            let data = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            if (data.length !== 0) {
                let ids = data.map(prod => prod.id)
                ids.sort((a, b) => b - a)
                producto.id = ids[0] + 1
                res = ids[0] + 1

            
            }
            else{
                producto.id = 1
                
            }
            data.push(producto)

            await fs.promises.writeFile(this.fileName, JSON.stringify(data, null, 2))
            return res
        } catch (error) {
            console.log(error)
        }
    }
    async getAll() {
        try {
            let data = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            return data
            
        } catch (error) {
            console.log(error)
            
        }
     
      
    }
    async deleteAll(){
        try {
            await fs.promises.writeFile(this.fileName, "[]")
        } catch (error) {
            console,log(error)
        }


    }   

    async getById(number){
        try {
            let data = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            let res = data.filter(producto => producto.id == number)
            if (res.length == 0){
                return null
            }
            else{
                
                
                return res[0]
            }
            
        } catch (error) {
            console.log(error)
            
            
        }
        
    }
    async deleteById(number){
        try {
            let data = JSON.parse(await fs.promises.readFile(this.fileName, 'utf-8'))
            let res = data.filter(producto => producto.id != number)
            await fs.promises.writeFile(this.fileName, JSON.stringify(res, null, 2))
        } catch (error) {
            console.log(error)
        }
    }

    async updateById(id, prod) {
        try {
            const productos = await this.getAll()
            let index = productos.findIndex(prod => prod.id == id)
            if ( index >= 0) {
                prod.id = id
                prod.price = Number(prod.price)
                productos[index] = prod
                await fs.promises.writeFile(this.fileName, JSON.stringify(productos, null, 2))

            }  
        } catch (error) {
            console.log(error)   
        }
    }









}



export {Contenedor}