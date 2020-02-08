const bunyan = require('bunyan');

const config = require('../config/firebase');

const { GenDragon } = require('../generator');
const { getNonGenerated, generatedUpdate } = require('../services/firebase');

const log = bunyan.createLogger({ name: 'eth-dragon-generator' });
const firebaseKEY = config.key;
const dragonType = 'dragon';
const limit = 1;

async function eggGenerator() {
  log.info('run dragon generator.');

  const needGenerate = await getNonGenerated(
    firebaseKEY,
    dragonType,
    limit
  );

  const needToGenerate = await Promise.all(needGenerate.map(async (dragon) => {
    log.info('try generate eggID:', dragon.id);
    
    const egg = new GenDragon(dragon.genColor, dragon.id);
    const result = await egg.onGenerateFragments();

    log.info('eggID:', dragon.id, 'has been generated.');

    return {
      ...result,
      ...dragon
    };
  }));

  return generatedUpdate(
    needToGenerate,
    firebaseKEY,
    dragonType
  );
}

eggGenerator();
