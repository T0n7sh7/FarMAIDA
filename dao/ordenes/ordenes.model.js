const getDb = require('../mongodb');
const ObjectId = require('mongodb').ObjectId;
let db = null;

class Ordenes{

    collection = null;

    constructor(){
        getDb()
        .then( (database)=>{
            db = database;
            this.collection = db.collection('Ordenes');
            if(process.env.MIGRATE === 'true'){
                //Por si se ocupa
            }
        });
    }//constructor

    //new
    async new(
        id,
        ordenEstado,
        ordenSubtotal,
        ordenDescuento,
        ordenImpuesto,
        ordenTotal,
        createdAt,
        updatedAt,
        usuarioId
    ){
        const newOrden = {
            id,
            ordenEstado,
            ordenSubtotal,
            ordenDescuento,
            ordenImpuesto,
            ordenTotal,
            createdAt,
            updatedAt,
            usuarioId
        };
        const rslt = await this.collection.insertOne(newOrden);
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
    async updateOne(){
        const filter = {_id : new ObjectId(id)};
        const updateCmd = {
            '$set':{
                id,
                ordenEstado,
                ordenSubtotal,
                ordenDescuento,
                ordenImpuesto,
                ordenTotal,
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

module.exports = Ordenes;
