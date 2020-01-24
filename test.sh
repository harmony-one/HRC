
#truffle migrate --reset --network local

truffle exec mint_transfer.js --network local
truffle exec show_balance.js --network local