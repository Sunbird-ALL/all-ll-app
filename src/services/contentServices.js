import axios from 'axios';
import uuid from 'react-uuid';

const schemaName = 'contents';
const getDb = () => {
  const SchemaData = localStorage.getItem(schemaName);
  return SchemaData ? JSON.parse(SchemaData) : {};
};

const saveDb = (data) => {
  localStorage.setItem(schemaName, JSON.stringify(data, null, 4));
};

export const getAll = () => {
  const db = getDb();
  const data = Object.keys(db).map(key => {
    const obj = {
      id: key,
      ...db[key],
    };

    // Filter out objects with null values
    const filteredObj = Object.entries(obj)
      .filter(([_, value]) => value !== null)
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {});

    return filteredObj;
  }).filter(data => data !== null);

  return data;
};


export const getOne = id => {
  const data = getAll();
  return data.find(it => it.id == id);
};

export const create = (data) => {
  const db = getDb();
  let id = "";
  data.id =  uuid();
  db[id+1] = data;
  saveDb(db);
};

export const update = data => {
  const db = getDb();
  const item = db[data.id];
  if (item) {
    const id = data.id;
    delete data.id;
    db[id] = data;

    saveDb(db);
  } else {
    console.log('data not found');
  }
};

export const destroy = (id, callback) => {
  const db = getDb();
  delete db[id];
  saveDb(db, callback);
};


export const publishDataOnServer = (item, callback) => {
  axios.post('https://all-content-respository-backend.onrender.com/v1/WordSentence', item)
    .then(response => {
      // Handle successful API response
      console.log('Data published successfully:', response.data);
      if (callback) {
        callback(response.data);
      }
    })
    .catch(error => {
      // Handle API error
      console.error('Error publishing data:', error);
      if (callback) {
        callback(null, error);
      }
    });
};
