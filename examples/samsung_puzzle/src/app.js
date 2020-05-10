const bodyParser = require('body-parser');
const express = require('express');
const { Mutex } = require('async-mutex');
const { initHarmony } = require('./harmony');
const _ = require('lodash');
/********************************
Contract Helpers
********************************/
const {
  getContractInstance,
  getContractAddress,
  txContractMethod,
  callContractMethod,
  oneToHexAddress,
  hexToOneAddress,
} = require('./contract');
const PuzzleJSON = require('../build/contracts/Puzzle.json');

/********************************
Initialization
********************************/
const ONE = 1000000000000000000; // 1 ONE in atto
const mutex = new Mutex();

/********************************
Config
********************************/
const config = require('../config');
const { url, port, timeLimit, txRate, proxy } = config;

/********************************
Express
********************************/
const app = express();
app.use(express.static('public'));
app.set('trust proxy', proxy);
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

/********************************
Expose Contract Address
********************************/
app.get('/exposeAddress', async (req, res) => {
  const initRes = await initHarmony(url);
  const { success, hmy } = initRes;
  if (!success) {
    res.send(initRes);
    return;
  }
  const puzzleAddress = hexToOneAddress(hmy, getContractAddress(PuzzleJSON));
  res.send({
    success: puzzleAddress ? 'true' : 'false',
    puzzleAddress,
  });
});

app.post('/api/submit', async function (req, res) {
  const release = await mutex.acquire();
  try {
    const { success, hmy } = await initHarmony(url);
    if (success) {
      console.log('success getting hmy');
    } else {
      res.status(200).json({ status: 'failed' });
      return;
    }
    const puzzle = getContractInstance(hmy, PuzzleJSON);

    let { address, score, board_state, sequence } = req.body;

    address = oneToHexAddress(hmy, address);
    const { hash, receipt, error } = await txContractMethod(
      puzzle,
      'payout',
      address,
      score,
      sequence,
      board_state
    );

    if (!error) {
      res
        .status(200)
        .json({ status: 'success', msg: '', tx: receipt.transactionHash });
    } else {
      res.status(200).json({ status: 'failed', msg: error.toString() });
    }
  } catch (err) {
    console.log('error in payout', err);
    res.status(200).json({ status: 'failed' });
  } finally {
    release();
  }
});

app.get('/api/leader_boards', async function (req, res) {
  try {
    const { success, hmy } = await initHarmony(url);
    if (success) {
      console.log('success getting hmy');
    }
    const puzzle = getContractInstance(hmy, PuzzleJSON);

    let topPlayers = await callContractMethod(puzzle, 'getTopPlayer');
    let topScores = await callContractMethod(puzzle, 'getTopScores');
    topPlayers = topPlayers.map((e) => hexToOneAddress(hmy, e));
    topScores = topScores.map((e) => Number(e));
    console.log(topPlayers);
    console.log(topScores);
    res.status(200).json({
      status: 'success',
      msg: '',
      leaders: _.range(topPlayers.length).map((k) => {
        const item = {
          address: topPlayers[k],
          score: topScores[k],
        };
        return item;
      }),
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      status: 'false',
    });
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
