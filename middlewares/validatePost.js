const validIfExists = (req, res, next) => {
  const obj = ['name', 'age'];
  const objKeys = Object.keys(req.body);
  for (let i = 0; i < obj.length; i += 1) {
    const key = objKeys[i];
    if (`${key}` !== obj[i]) {
      return res.status(400).json({ message: `O campo "${obj[i]}" é obrigatório` });
    } 
  } 
  if (!objKeys.includes('talk')) {
    return res.status(400).json({
      message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios',
    });
  }
  next();
};

const validateParameters = (req, res, next) => {
  const { name, age, talk: { watchedAt, rate } } = req.body;
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  if (age < 18) {
    return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  if (!watchedAt || rate === undefined) {
    return res.status(400).json(
      { message: 'O campo "talk" é obrigatório e "watchedAt" e "rate" não podem ser vazios' },
    );
  }
  next();
};

const validateTalk = (req, res, next) => {
  const { talk: { watchedAt, rate } } = req.body;
  if (!watchedAt.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)) {
    return res.status(400).json(
      { message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' },
    );
  }
  if (!Number.isInteger(rate) || rate < 1 || rate > 5) {
    return res.status(400).json(
      { message: 'O campo "rate" deve ser um inteiro de 1 à 5' },
    );
  }
    
  next();
};

module.exports = { validateParameters, validIfExists, validateTalk };