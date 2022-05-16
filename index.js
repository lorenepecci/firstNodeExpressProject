const express = require('express');
const bodyParser = require('body-parser');
/* const data = require('./talker.json'); */
const { readFileFunc } = require('./helpers/fs');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const object = await readFileFunc('talker.json');
  console.log('lorene');
  res.status(200).json(object);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc('talker.json');
  const findID = data.find((obj) => obj.id === Number(id));
  console.log(findID);
  if (!findID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findID);
});
 
app.listen(PORT, () => {
  console.log('Online');
});
