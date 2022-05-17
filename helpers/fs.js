const fs = require('fs').promises;

const readFileFunc = async (arq) => {
  try {
    const leitura = await fs.readFile(arq, 'utf-8');
    return JSON.parse(leitura);
  } catch (err) {
    return err;
  }
};

const writeFileFunc = async (arq, newObj, idparam) => {
  const read = await readFileFunc(arq);
  const { name, age, talk: { watchedAt, rate } } = newObj;
  let id;
  let newArray;
  let obj;
    if (!idparam) {
      id = JSON.parse(read.length + 1);
      obj = { name, age, id, talk: { watchedAt, rate } };
      newArray = [...read, obj];
    } else {
      id = Number(idparam);
      obj = { ...read[id], name, age, id, talk: { watchedAt, rate } }; 
      newArray = read;
      newArray[id - 1] = obj;
    }
    console.log(newArray); 
    await fs.writeFile(arq, JSON.stringify(newArray), 'utf-8');
    return obj;
};

module.exports = { readFileFunc, writeFileFunc };