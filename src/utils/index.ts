export const generateTempId = (): string => {
  let id = '';
  for (let x = 0; x < 20; x++) {
    id += Math.round(Math.random() * 10);
  }

  return id;
};

export const generateRandomName = (): string => {
  const vocabulary = 'ABCDEFGHIJKLMNOUPRSTUWZabcdefghijklmnouprstuwz';
  let name = '';
  for (let x = 0; x < 12; x++) {
    name += vocabulary[Math.floor(Math.random() * vocabulary.length)];
  }
  return name;
};
