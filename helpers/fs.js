const fs = require('fs').promises;

const readFileFunc = async (arq) => {
  try {
    const leitura = await fs.readFile(arq, 'utf-8');
    return JSON.parse(leitura);
  } catch (err) {
    return err;
  }
};

const writeFileFunc = async (arq, newObj) => {
  try {
    const read = await readFileFunc(arq);
    const { name, age, talk: { watchedAt, rate } } = newObj;
    const id = JSON.parse(read.length + 1);
    console.log(id);
    const obj = { name, age, id, talk: { watchedAt, rate } };
    console.log(JSON.stringify(obj)); 
    const newArray = [...read, obj];
    /* console.log(newArray); */
    await fs.writeFile(arq, JSON.stringify(newArray), 'utf-8');
    return obj;
  } catch (err) {
    return err;
  }
};

module.exports = { readFileFunc, writeFileFunc };