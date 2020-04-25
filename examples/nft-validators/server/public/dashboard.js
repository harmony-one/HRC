
const qs = (x) => document.querySelector(x)
const init = () => {
    qs('#submit').onclick = () => {
        qs('#output').innerHTML = ''
        qs('#loading').style.display = 'block'
        const limit = qs('#limit').value
        const price = qs('#price').value
        const media = qs('#media').value
        const owner = qs('#owner').value || ''
        fetch('/create?limit=' + limit + '&price=' + price + '&media=' + media + '&owner=' + owner)
            .then((res) => res.json())
            .then((res) => {
                console.log(res)
                qs('#loading').style.display = 'none'
                if (res.success === true) {
                    qs('#output').innerHTML = '<p>Item created successfully</p>'
                } else {
                    qs('#output').innerHTML = '<p>An error occurred. Please try again!</p>'
                }
            })
    }
}
window.onload = init