const ObjectId = require('mongodb').ObjectId;
const getDb = require('../mongodb');
let db = null;

class Carritos{

    collection = null;

    constructor(){
        getDb()
        .then((database)=>{
            db = database;
            this.collection = db.collection('Carritos');
            if(process.env.MIGRATE === 'true'){
                //Por si se ocupa

            }
        });
    }//constructor

    //new
    async new(id, carritoEstado, createdAt, updatedAt, usuarioId){
        const newCarrito = {id, carritoEstado, createdAt, updatedAt, usuarioId};
        const rslt = await this.collection.insertOne(newCarrito);
        return rslt;
    }

    //getAll
    async getAll(){
        const cursor = await this.collection.find({});
        documents = cursor.toArray();
        return documents;
    }

    //getById
    async getById(id){
        const _id = new ObjectId(id);
        const filter = {_id};
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
    async updateOne(id){
        const filter = {_id: new ObjectId(id)};
        const updateCmd = {
            '$set':{
                id, 
                carritoEstado,
                createdAt,
                updatedAt,
                usuarioId
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

}//class

module.exports = Carritos;