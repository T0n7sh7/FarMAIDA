const ObjectId  = require('mongodb').ObjectId;
const getDb = require('../mongodb');
let db = null;
class Laboratorios {
    collection = null;
  constructor() {
    getDb()
    .then( (database) => {
      db = database;
      this.collection = db.collection('Laboratorios');
      if (process.env.MIGRATE === 'true') {
          // Por si se ocupa algo
      }
    })
    .catch((err) => { console.error(err)});
  }

  //Insert
  async new ( LaboratorioNombre, LaboratorioDescripcion) {
    const newLaboratorio = {
        LaboratorioNombre,
        LaboratorioDescripcion
    };
    const rslt = await this.collection.insertOne(newLaboratorio);
    return rslt;
  }

  //Get
  async getAll(){
    const cursor = this.collection.find({});
    const documents = await cursor.toArray();
    return documents;
      
  }

  async getFaceted(page, items, filter = {}){
    const cursor = this.collection.find(filter);
    const totalItems = await cursor.count();
    cursor.skip((page -1)*items);
    cursor.limit(items);

    const resultados = await cursor.toArray();
    return {totalItems, page, items, totalPages: (Math.ceil(totalItems/items)), resultados};
  }

  async getById(id){
    const _id = new ObjectId(id);
    const filter = {_id};
    const myDocument = await this.collection.findOne(filter);
    return myDocument;
    
    }

    //Update
    async updateOne(id, LaboratorioNombre, LaboratorioDescripcion){
      const filter = {_id: new ObjectId(id)};
      const updateCmd = {
        '$set':{
          LaboratorioNombre,
          LaboratorioDescripcion
        }
      };
      return await this.collection.updateOne(filter, updateCmd);
  
    }

    async updateAddTagSet(id, tagEntry){
      const updateCmd = {
        "$addToSet": {
          tags: tagEntry
        }
      }
      const filter = {_id: new ObjectId(id)};
      return await this.collection.updateOne(filter, updateCmd);
    }

    async updatePopTag(id, tagEntry) {
      console.log(tagEntry);
      const updateCmd = [{
        '$set': {
          'tags': {
            '$let': {
              'vars': { 'ix': { '$indexOfArray': ['$tags', tagEntry] } },
              'in': {
                '$concatArrays': [
                  { '$slice': ['$tags', 0, {'$add':[1,'$$ix']}]},
                  [],
                  { '$slice': ['$tags', { '$add': [2, '$$ix'] }, { '$size': '$tags' }] }
                ]
              }
            }
          }
        }
      }];
      const filter = { _id: new ObjectId(id) };
      return await this.collection.updateOne(filter, updateCmd);
    }

    //Delete
    async deleteOne(id){
      const filter = {_id: new ObjectId(id)};
      return await this.collection.deleteOne(filter);
    }
    async deleteOneName(LaboratorioNombre){
      return await this.collection.findOneAndDelete({LaboratorioNombre:LaboratorioNombre });
    }
}

module.exports = Laboratorios;