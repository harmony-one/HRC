# Dapp Lottery

Here is the Tutorial, teaching you to build a dapp step by step, you can follow it, or to downlaod the code directly! 

# Part 1: Lottery Contract
```
$ truffle init
```

### Install Harmony SDK https://github.com/harmony-one/sdk  
```
$ npm install @harmony-js/core@next
$ npm install tslib
```

### Change **truffle-config** and add **.env** 
```
$ npm isntall dotenv
```
Truffle-config
```javascript
require('dotenv').config()
const { TruffleProvider } = require('@harmony-js/core')
//Local
const local_mnemonic = process.env.LOCAL_MNEMONIC
const local_private_key = process.env.LOCAL_PRIVATE_KEY
const local_url = process.env.LOCAL_0_URL;
//Testnet
const testnet_mnemonic = process.env.TESTNET_MNEMONIC
const testnet_private_key = process.env.TESTNET_PRIVATE_KEY
const testnet_url = process.env.TESTNET_0_URL
//Mainnet
const mainnet_mnemonic = process.env.MAINNET_MNEMONIC
const mainnet_private_key = process.env.MAINNET_PRIVATE_KEY
const mainnet_url = process.env.MAINNET_0_URL;

//GAS - Currently using same GAS accross all environments
gasLimit = process.env.GAS_LIMIT
gasPrice = process.env.GAS_PRICE

module.exports = {
  networks: {
    local: {
      network_id: '2', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          local_url,
          { memonic: local_mnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: gasLimit, gasPrice: gasPrice},
        );
        const newAcc = truffleProvider.addByPrivateKey(local_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
    testnet: {
      network_id: '2', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          testnet_url,
          { memonic: testnet_mnemonic },
          { shardID: 0, chainId: 2 },
          { gasLimit: gasLimit, gasPrice: gasPrice},
        );
        const newAcc = truffleProvider.addByPrivateKey(testnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
    mainnet: {
      network_id: '1', 
      provider: () => {
        const truffleProvider = new TruffleProvider(
          mainnet_url,
          { memonic: mainnet_mnemonic },
          { shardID: 0, chainId: 1 },
          { gasLimit: gasLimit, gasPrice: gasPrice },
        );
        const newAcc = truffleProvider.addByPrivateKey(mainnet_private_key);
        truffleProvider.setSigner(newAcc);
        return truffleProvider;
      },
    },
  },

  mocha: {
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.5.8"
    }
  }
}
```
.env
```javascript
//LOCAL
//Local uses account one103q7qe5t2505lypvltkqtddaef5tzfxwsse4z7 on Shard 0
LOCAL_PRIVATE_KEY='45e497bd45a9049bcb649016594489ac67b9f052a6cdf5cb74ee2427a60bf25e'
LOCAL_MNEMONIC='urge clog right example dish drill card maximum mix bachelor section select' 
LOCAL_0_URL='http://localhost:9500'

//TESTNET
//Account: one18t4yj4fuutj83uwqckkvxp9gfa0568uc48ggj7
TESTNET_PRIVATE_KEY='01F903CE0C960FF3A9E68E80FF5FFC344358D80CE1C221C3F9711AF07F83A3BD'
TESTNET_MNEMONIC='urge clog right example dish drill card maximum mix bachelor section select' 
TESTNET_0_URL='https://api.s0.b.hmny.io'

//MAINNET
//Please replace MAINNET_PRIVATE_KEY and MAINNET_MNEMONIC with your own!
//Account: one18t4yj4fuutj83uwqckkvxp9gfa0568uc48ggj7
MAINNET_PRIVATE_KEY='01F903CE0C960FF3A9E68E80FF5FFC344358D80CE1C221C3F9711AF07F83A3BD'
MAINNET_MNEMONIC='urge clog right example dish drill card maximum mix bachelor section select' 
MAINNET_0_URL='https://api.s0.t.hmny.io'

GAS_LIMIT=3321900
GAS_PRICE=1000000000
```

## Create your Smart Contract (lottery)

### Create a file name Lottery.sol under contracts folder.
```javascript
pragma solidity  >=0.5.8;

contract Lottery {
    address payable public manager;
    address payable[] public players;

    modifier restricted {
        require(msg.sender == manager);
        _; // '_': run all the reset of codes inside the function.
    }

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        players.push(msg.sender);
    }

    // Pseudo Random Number Generator (Not exist in solidity, should write by ourself)
    function random() private view returns (uint) {
        return uint(uint(keccak256(abi.encodePacked(block.difficulty,now,players))));
    }

    function pickWinner() public restricted {
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        resetPlayers();
    }

    function resetPlayers() private {
        players = new address payable[](0);
    }

    function getPlayers() public view returns (address payable[] memory) {
        return players;
    }
}
```

### Create the file 2_deploy_contracts.js under migrations folder
```java
var Lottery = artifacts.require("Lottery");

module.exports = function(deployer) {
  deployer.deploy(Lottery);
};
```

### Compile and deploy the contract!
```
$ truffle compile

$ truffle migrate --network local --reset
$ truffle migrate --network testnet --reset
```

# Part 2: Lottery Frontend

## Using react to create an front-end module
We used the create-react-app to generate a simple front-end for our app
```C
// do that if you never used create-react-app before
$ sudo npm install -g create-react-app

$ create-react-app frontend(NAME)
```
Install Harmony js SDK
```
$ npm install @harmony-js/core@next
$ npm install tslib
```

After that, Create a file named lottery.js, which would be used for create the instance of contract

***remember to replace the address to your smart-contract address***  
***which could be found when you deploy your contract***

```C
const { Harmony, HarmonyExtension } = require('@harmony-js/core');
const { ChainID, ChainType } = require('@harmony-js/utils');

const url = 'http://localhost:9500';
const hmy = new Harmony(url, {
  chainType: ChainType.Harmony,
  chainId: ChainID.HmyLocal
});

const address = '0x2C85312662258F7cc063E421DCF16bb0189b0531';
const abi = [
  {
    "constant": true,
    "inputs": [],
    "name": "manager",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "players",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "enter",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [],
    "name": "pickWinner",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "getPlayers",
    "outputs": [
      {
        "name": "",
        "type": "address[]"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

export const waitForInjected = () => new Promise((resolve) => {
  const check = () => {
      if (!window.harmony) setTimeout(check, 250);
      else resolve(window.harmony);
  }
  check();
});

let harmonyEx, extLottery;
export const initExtension = async() => {
  harmonyEx = await new HarmonyExtension(window.harmony);

  extLottery = harmonyEx.contracts.createContract(abi, address);
  return extLottery;
};

export { hmy };
```

Then, change the content in App.js
```javascript
import React, { Component } from 'react';
import './App.css';
import { waitForInjected, initExtension, hmy } from './lottery';

class App extends Component {
  state = {
    manager: '',
    players: [],
    balance: '',
    value: '',
    message: ''
  };

  async componentDidMount() {
    await waitForInjected()

    const extLottery = await initExtension()
    const manager = await extLottery.methods.manager().call({
      gasLimit: '1000000',
      gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });
    const players = await extLottery.methods.getPlayers().call({
      gasLimit: '1000000',
      gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });
    const balance = await hmy.blockchain.getBalance({address: extLottery.address});

    this.setState({ manager, players, balance });
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({ message: 'Waiting on transaction success...' })

    const extLottery = await initExtension()
    await extLottery.methods.enter().send({
      value: new hmy.utils.Unit(this.state.value).asOne().toWei(),
      gasLimit: '1000001',
      gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });

    this.setState({ message: 'You have been entered!' })
  };

  onClick = async () => {
    this.setState({ message: 'Waiting on transaction success...' });

    const extLottery = await initExtension()
    await extLottery.methods.pickWinner().send({
      gasLimit: '1000000',
      gasPrice: new hmy.utils.Unit('10').asGwei().toWei(),
    });

    this.setState({ message: 'A winner has been picked!' });
  };

  render() {
    return (
      <div>
        <h2> Lottery Contract </h2>
        <p> 
          This contract is managed by {this.state.manager}. <br />
          There are currently {this.state.players.length} people entered, <br />
        </p>

        <hr />
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount of ONE to enter</label>
            <input
              value={this.state.value}
              onChange={event => this.setState({ value: event.target.value })}
            />
          </div>
          <button>Enter</button>
        </form>

        <hr />
        <h4> Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a Winner!</button>

        <hr />
        <h1>{this.state.message}</h1>
      </div>
    );
  };
}

export default App;
```

Now the dapp should be finished! Using npm start to try it!
```
npm start
```

It will require you to used Mathwallet to sign the transaction!

## Much more details will list in the subFolders: frontend and lotteryContract!!!