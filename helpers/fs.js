const fs = require('fs').promises;

const readFileFunc = async (arq) => {
  try {
    const leitura = await fs.readFile(arq, 'utf-8');
    return JSON.parse(leitura);
  } catch (err) {
    return err;
  }
};

const writeFileFunc = async (arq, json) => {
  try {
    const write = await fs.writeFile(arq, JSON.stringify(json), 'utf-8');
    return write;
  } catch (err) {
    return err;
  }
};

const putOrPostWriteFile = async (arq, newObj, idparam) => {
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
      id = idparam;
      obj = { ...read[id], name, age, id, talk: { watchedAt, rate } }; 
      newArray = read;
      newArray[id - 1] = obj;
    }
    await writeFileFunc(arq, newArray);
    return obj;
};

module.exports = { readFileFunc, writeFileFunc, putOrPostWriteFile };