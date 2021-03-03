const db = require("monk")(process.env.DB);

//Add data in Collection
async function addData(collectionName, data) {
  const collection = db.get(collectionName);
  await collection.insert(data);
  return;
}

//Search data in a Collection
async function searchData(collectionName, data) {
  const collection = db.get(collectionName);
  let result = await collection.find(data, { sort: { date: -1 } });
  return result;
}

//Update data in Collection
async function updateData(collectionName, id, data) {
  const collection = db.get(collectionName);
  await collection.update({ _id: id }, { $set: data });
  return;
}

module.exports = { addData, searchData, updateData };
