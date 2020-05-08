truffle migrate --reset --network ${1}

rm -rf ./client/src/build/*
cp -r ./build/* ./client/src/build/