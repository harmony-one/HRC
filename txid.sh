
TXID=0xf6fa4d7912bc40c632627e52040b4af632f52f5c79d9b4648ca9a03cad2f4384
curl -X POST http://localhost:9500 -H 'Content-Type: application/json' -d '{
    "jsonrpc":"2.0",
    "method":"hmy_getTransactionReceipt",
    "params":["'$TXID'"],
    "id":1
}'