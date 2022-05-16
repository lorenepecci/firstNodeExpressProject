const fs = require('fs').promises;

const readFileFunc = async (arq) => {
  try {
    const leitura = await fs.readFile(arq, 'utf-8');
    return JSON.parse(leitura);
  } catch (err) {
    return err;
  }
};

module.exports = { readFileFunc };