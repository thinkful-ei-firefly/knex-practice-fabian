require('dotenv').config()
const knex = require('knex')

const knexInstance = knex({
  client: 'pg',
  connection: process.env.DB_URL,
})

function searchByShoppingListName (searchTerm){
  knexInstance
  .from('shopping_list')
  .where('name', 'ilike', `%${searchTerm}%`)
  .then(result => {
    console.log(result);
  });

}

function paginateShoppingList(pageNumber){
  const productsPerPage = 6
  const offset = productsPerPage * (pageNumber - 1)
  knexInstance
  .from('shopping_list')
  .limit(productsPerPage)
  .offset(offset)
  .then(result => {
    console.log(result);
  })
}

function itemsAddedAfter(daysAgo){
  knexInstance
  .from('shopping_list')
  .where('date_added', '>', knexInstance.raw(`now() - '?? days'::INTERVAL`, daysAgo))
  .then(result => {
    console.log(result);
  });
}

function totalCostByCategory(){
  knexInstance
  .select('category')
  .sum('price as total_price')
  .from('shopping_list')
  .groupBy('category')
  .then(result => {
    console.log(result);
  });
}

//searchByShoppingListName('chi')
//paginateShoppingList(2)
//itemsAddedAfter(2);
//totalCostByCategory();

console.log('connection successful');
