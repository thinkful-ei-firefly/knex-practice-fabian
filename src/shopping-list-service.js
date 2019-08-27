const ShoppingListService = {
  getAllShoppingList(db){
    return db
      .select('*')
      .from('shopping_list');
  },

  getById(db, id) {
    return db
    .select('*')
    .from('shopping_list')
    .where('id', id)
    .then(result => {
      if (!result[0]) return false;
      return result[0];
    })
  },

  insertShoppingList(db, newData){
    return db
      .into('shopping_list')
      .insert(newData)
      .returning('*')
      .then(result => result[0])
      .catch(error => Promise.resolve(false));
  },

  deleteShoppingList(db, dataId){
    return db('shopping_list')
      .where({id: dataId})
      .delete();
  },

  editShoppingList(db, dataId, editedData){
    return db('shopping_list')
      .where({id: dataId})
      .update(editedData)
      .catch(error => Promise.resolve(false));
  }
}

module.exports = ShoppingListService;
