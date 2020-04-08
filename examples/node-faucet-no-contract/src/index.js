const {recaptchaPublicKey} = require('../config')

module.exports = `<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <title>Harmony Test Faucet</title>
    <link rel="stylesheet" href="app.css" />
    <script src="https://www.google.com/recaptcha/api.js" async defer></script>
</head>

<body>
    <header>
        <img src="logo.svg" />
        <h1>ONE Faucet</h1>
    </header>
    <div id="faucet">
        <p>Enter your ONE address and click fund.<br />We'll send a transaction to the Harmony blockchain</p>
        <input id="input" placeholder="ONE Address" type="text" />
        <br>
        <button id="submit" disabled>Fund</button>
        <br>
        <div id="recaptcha" class="g-recaptcha" data-callback="recaptchaCallback" data-sitekey="${recaptchaPublicKey}">
        </div>
        <br>
        <p id="loading">Queuing...</p>
        <p id="output"></p>
    </div>
    <script>
        const qs = (x) => document.querySelector(x)
        const init = () => {
            qs('#submit').disabled = 'true'
            qs('#loading').style.display = 'none'
            window.recaptchaCallback = function recaptchaCallback(token){
                qs('#submit').removeAttribute('disabled')
                qs('#submit').onclick = () => {
                    qs('#output').innerHTML = ''
                    qs('#loading').style.display = 'block'
                    const address = qs('#input').value
                    fetch('/fund',  {
                        method: 'POST',
                        headers: {
                            'Content-type': 'application/json',
                        },
                        body: JSON.stringify({
                            address,
                            token
                        })
                    })
                        .then((res) => res.json())
                        .then((res) => {
                            qs('#loading').style.display = 'none'
                            if (res.success === true) {
                                qs('#output').innerHTML = '<h4>Queued!</h4>' + res.message
                            } else {
                                qs('#output').innerHTML = '<h4>An error occurred!</h4>' + res.message
                            }
                        })
                }
            }
        }
        window.onload = init
    </script>
</body>

</html>`