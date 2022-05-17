const express = require('express');
const bodyParser = require('body-parser');
const { readFileFunc, writeFileFunc, writeFromDelete } = require('./helpers/fs');
const { generateToken } = require('./helpers/generateToken');
const { validation } = require('./middlewares/validation');
const { autenticated } = require('./middlewares/autenticated');
const { validatePost, validIfExists, validateTalk } = require('./middlewares/validatePost');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';
const file = 'talker.json';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.get('/talker', async (_req, res) => {
  const object = await readFileFunc(file);
  res.status(200).json(object);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const findID = data.find((obj) => obj.id === Number(id));
  if (!findID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findID);
});

app.post('/talker', autenticated, validIfExists, validatePost,
  validateTalk, async (req, res) => {
  const objNew = await writeFileFunc(file, req.body, null);
  return res.status(201).json(objNew); 
});

app.put('/talker/:id', autenticated, validIfExists, validatePost, validateTalk,
  async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const findObj = data.find((obj) => obj.id === Number(id));
  if (!findObj) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  const objNew = await writeFileFunc(file, req.body, id);
  return res.status(200).json(objNew); 
  });

app.delete('/talker/:id', autenticated, async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc(file);
  const filterData = data.filter((obj) => obj.id !== Number(id));
  await writeFromDelete(file, filterData);
  res.status(204).end();
});
    
app.post('/login', validation, (_req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
}); 
 
app.listen(PORT, () => {
  console.log('Online');
});
