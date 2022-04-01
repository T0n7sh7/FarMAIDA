const ObjectId  = require('mongodb').ObjectId;
const getDb = require('../mongodb');
const bcrypt = require('bcryptjs');
let db = null;
class Usuarios {
    collection = null;
  constructor() {
    getDb()
    .then( (database) => {
      db = database;
      this.collection = db.collection('Usuarios');
      if (process.env.MIGRATE === 'true') {
          // Por si se ocupa algo
          this.collection.createIndex({"usuarioContrasena":1},{unique: true}).then((rlst)=>{
            console.log("Indice creado satisfactoriamente", rlst);
        }).catch((err)=>{
            console.error("Error al crear indice", err);
        });
      }
    })
    .catch((err) => { console.error(err)});
  }

  //Insert
  async new ( usuarioNombre, usuarioTelefono, usuarioCorreo, usuarioContrasena, usuarioDireccion, usuarioFechaNacimiento, usuarioSexo, usuarioAdmin, usuarioRegistrado, usuarioUltimoLog) {
    const newUsuario = {
        usuarioNombre,
        usuarioTelefono,
        usuarioCorreo,
        usuarioContrasena: await this.hashPassword(usuarioContrasena),
        usuarioDireccion,
        usuarioFechaNacimiento,
        usuarioSexo,
        usuarioAdmin,
        usuarioRegistrado,
        usuarioUltimoLog
    };
    const rslt = await this.collection.insertOne(newUsuario);
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
    async getByEmail(usuarioCorreo){
      const filter = {usuarioCorreo};
      const myDocument = await this.collection.findOne(filter);
      return myDocument;
      
    }
    async getByPhone(usuarioTelefono){
      const filter = {usuarioTelefono};
      const myDocument = await this.collection.findOne(filter);
      return myDocument;
      
    }

    //Update
    async updateOne(id, usuarioNombre, usuarioTelefono, usuarioCorreo, usuarioContrasena, usuarioDireccion, usuarioFechaNacimiento, usuarioSexo, usuarioAdmin, usuarioRegistrado, usuarioUltimoLog){
      const filter = {_id: new ObjectId(id)};
      const updateCmd = {
        '$set':{
          usuarioNombre,
          usuarioTelefono,
          usuarioCorreo,
          usuarioContrasena: await this.hashPassword(usuarioContrasena),
          usuarioDireccion,
          usuarioFechaNacimiento,
          usuarioSexo,
          usuarioAdmin,
          usuarioRegistrado,
          usuarioUltimoLog
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

    async updatePassword(usuarioCorreo, usuarioContrasena){
      const filter = {usuarioCorreo};
      const updateCmd = {
        '$set':{
          usuarioContrasena: await this.hashPassword(usuarioContrasena),
        }
      };
      return await this.collection.updateOne(filter, updateCmd);
  
    }

    //Delete
    async deleteOne(id){
      const filter = {_id: new ObjectId(id)};
      return await this.collection.deleteOne(filter);
    }
    //Hash
    async hashPassword(rawPassword){
      return await bcrypt.hash(rawPassword, 10);
      }
  
    async comparePassword(rawPassword, dbPassword){
      return await bcrypt.compare(rawPassword,dbPassword);
  }
}

module.exports = Usuarios;