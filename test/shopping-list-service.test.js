const shoppingService = require('../src/shopping-list-service');
const knex = require('knex');

describe('Test Shopping List Service', () => {
  let db;
  const dataAux = [
    {
      id: 1,
      name: "Name 1",
      price:3.23,
      category: "Main"
    },
    {
      id: 2,
      name: "Name 3",
      price:4.23,
      category: "Breakfast"
    },
    {
      id: 3,
      name: "Name 4",
      price:3.63,
      category: "Main"
    }
  ];

  before(() => {
    db = knex({
      client: 'pg',
      connection: process.env.DB_URL_TEST
    })
  })

  before(() => {
    return db('shopping_list').truncate();
  })

  afterEach(() => {
    return db('shopping_list').truncate();
  })

  after(() => {
    return db.destroy();
  })

  describe('Reading test', () => {
    it('GetAll Test with no data', () => {
      return shoppingService.getAllShoppingList(db)
        .then(result => {
          expect(result).to.be.an('array');
          expect(result).to.have.lengthOf(0);
        });
    })

    context('GetAll Test with data', () => {
      before(() => {
        return db('shopping_list').insert(dataAux);
      })

      it('With data', () => {
        return shoppingService.getAllShoppingList(db)
          .then(result => {
            expect(result).to.be.an('array');
            expect(result).to.have.lengthOf(3);
            expect(result[0]).to.have.all.keys('id', 'name', 'price', 'category', 'checked', 'date_added');
            expect(result[0].name).to.equal(dataAux[0].name);
          });
      })
    })
  })

  describe('Inserting test', () => {
    const newData = {
      name: "Name 7",
      price:3.93,
      category: "Main"
    };

    it('Insert valid data', () => {
      return shoppingService.insertShoppingList(db, newData)
        .then(result => {
          expect(result).to.be.an('object');
          expect(result).to.have.all.keys('id', 'name', 'price', 'category', 'checked', 'date_added');
          expect(result.name).to.equal(newData.name);
        })
    })

    it('Insert invalid data', () => {
      const newAuxData = {...newData};
      delete newAuxData.name;
      return shoppingService.insertShoppingList(db, newAuxData)
        .then(result => {
          expect(result).to.be.an('boolean');
          expect(result).to.equal(false);
        })
    })
  })

  describe('Deleting test', () => {
    beforeEach(() => {
      return db('shopping_list').insert(dataAux);
    })

    afterEach(() => {
      return db('shopping_list').truncate();
    })

    it('Delete valid id', () => {
      const shoppingId = 1;
      return shoppingService.deleteShoppingList(db, shoppingId)
        .then(() => shoppingService.getAllShoppingList(db))
        .then(allData => {
         let flag = true;
         const expected = dataAux.filter(article => article.id !== shoppingId)
         for (let i = 0; i < expected.length; i++){
           if(expected[i].name !== allData[i].name) {
             flag = false;
             break;
           }
         }
         expect(flag).to.eql(true);
       })
    })

    it('Delete invalid id', () => {
      const shoppingId = 10;
      return shoppingService.deleteShoppingList(db, shoppingId)
        .then(() => shoppingService.getAllShoppingList(db))
        .then(allData => {
         let flag = true;
         const expected = dataAux.filter(article => article.id !== shoppingId)
         for (let i = 0; i < expected.length; i++){
           if(expected[i].name !== allData[i].name) {
             flag = false;
             break;
           }
         }
         expect(flag).to.eql(true);
      })
    })

  })

  describe('Editing Test', () => {
    const idEditData = 2;
    const idInvalidEditData = 20;
    const newEditData = {
      name: "Name 36",
      price:3.13,
      category: "Main"
    }
    const newInvalidEditData = {
      name: null,
      price:3.13,
      category: "Main"
    }

    beforeEach(() => {
      return db('shopping_list').insert(dataAux);
    })

    afterEach(() => {
      return db('shopping_list').truncate();
    })

    it('Edit valid data', () => {
      return shoppingService.editShoppingList(db, idEditData, newEditData)
        .then(() => shoppingService.getById(db, idEditData))
        .then(article => {
          expect(article.name).to.eql(newEditData.name);
          expect(article.category).to.eql(newEditData.category);
        })
    })

    it('Edit invalid id', () => {
      return shoppingService.editShoppingList(db, idInvalidEditData, newEditData)
        .then(() => shoppingService.getById(db, idInvalidEditData))
        .then(result => {
          expect(result).to.be.an('boolean');
          expect(result).to.equal(false);
        })
    })

    it('Edit invalid data', () => {
      return shoppingService.editShoppingList(db, idEditData, newInvalidEditData)
        .then(result => {
          expect(result).to.be.an('boolean');
          expect(result).to.equal(false);
        })
    })
  })

})
