const express = require('express');
const bodyParser = require('body-parser');
/* const data = require('./talker.json'); */
const { readFileFunc, writeFileFunc } = require('./helpers/fs');
const { generateToken } = require('./helpers/generateToken');
const { validation } = require('./middlewares/validation');
const { autenticated } = require('./middlewares/autenticated');
const { validatePost, validIfExists, validateTalk } = require('./middlewares/validatePost');

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
  res.status(200).json(object);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const data = await readFileFunc('talker.json');
  const findID = data.find((obj) => obj.id === Number(id));
  if (!findID) {
    return res.status(404).json({ message: 'Pessoa palestrante não encontrada' });
  }
  return res.status(200).json(findID);
});

app.post('/talker', autenticated, validIfExists, validatePost,
  validateTalk, async (req, res) => {
  /* const { age, name, talk: { watchedAt, rate } } = req.body; */
  const objNew = await writeFileFunc('talker.json', req.body);
  return res.status(201).json(objNew); 
});

app.post('/login', validation, (_req, res) => {
  const token = generateToken();
  res.status(200).json({ token });
}); 
 
app.listen(PORT, () => {
  console.log('Online');
});
