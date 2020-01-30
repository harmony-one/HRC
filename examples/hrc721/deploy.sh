truffle migrate --reset --network ${1}

rm -rf ./src/build/*
cp -r ./build/* ./src/build/