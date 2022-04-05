const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');
let db = null;

class Productos{

    collection = null;

    constructor(){
        getDb()
        .then( (database)=>{
            db = database;
            this.collection = db.collection('Productos');
            if(process.env.MIGRATE === 'true'){
                //Por si se ocupa
            }
        })
        .catch((err) => { console.error(err)});
    }//constructor

    //new    
    async new(
        productoNombre, 
        productoDescripcion,
        productoPrecio,
        productoActivo,
        productoImagen,
        laboratorioId,
        presentacionId 
    ){
        const createdAt = new Date();
        const updatedAt = new Date();
        const newProducto = {
            productoNombre, 
            productoDescripcion,
            productoPrecio,
            productoActivo,
            productoImagen,
            createdAt,
            updatedAt,
            laboratorioId,
            presentacionId
        };
        const rslt = await this.collection.insertOne(newProducto);
        return rslt;
    }

    //getAll
    async getAll(){
        const cursor = this.collection.find({});
        const documents = await cursor.toArray();
        return documents;
    }

    //getById    
    async getById(id){
        const filter = {_id : new ObjectId(id)};
        const myDocument = await this.collection.findOne(filter);
        return myDocument;
    }

    //getFaceted
    async getFaceted(page, items, filter = {}){
        const cursor = this.collection.find(filter);
        const totalItems = await cursor.count();
        const totalPages = Math.ceil(totalItems/items);
        cursor.skip((page - 1) * items);
        cursor.limit(items);

        const documents = await cursor.toArray();
        return {totalPages, totalItems, page, items, documents};
    }

    //updateOne
    async updateOne(id,productoNombre, 
        productoDescripcion,
        productoPrecio,
        productoActivo,
        productoImagen,
        laboratorioId,
        presentacionId){
        const filter = {_id : new ObjectId(id)};
        const updatedAt = new Date();
        const updateCmd = {
            '$set':{
                productoNombre, 
                productoDescripcion,
                productoPrecio,
                productoActivo,
                productoImagen,
                updatedAt,
                laboratorioId,
                presentacionId
            }
        };
        const rslt = await this.collection.updateOne(filter, updateCmd);
        return rslt;
    }

    //update tag
    async updateAddTag(id, tagEntry){
        const filter = {_id: new ObjectId(id)};
        const updateCmd = {
            '$push':{
                tags: tagEntry
            }
        };
        const rslt = await this.collection.updateOne(filter, updateCmd);
        return rslt;
    }

    //update tag set
    async updateAddTagSet(id, tagEntry){
        const filter = {_id: new ObjectId(id)};
        const updateCmd = {
            '$addToSet':{
                tags: tagEntry
            }
        };
        const rslt = await this.collection.updateOne(filter, updateCmd);
        return rslt;
    }

    //deleteOne
    async deleteOne(id){
        const filter = {_id : new ObjectId(id)};
        const rslt = await this.collection.deleteOne(filter);
        return rslt;
    }

    async deleteOneName(productoNombre){
        return await this.collection.findOneAndDelete({productoNombre:productoNombre });
      }


}//class

module.exports = Productos;