const http = require('https');

const url = new URL('https://www.ted.com/talks/helen_czerski_the_fascinating_physics_of_everyday_life/transcript?language=pt-br#t-81674');

http.get(url, (res) => {
    let error;
    if( res.statusCode != 200){
        error = new Error(`Falha na requisição\nStatus Code: ${res.statusCode}`);
    }
    if (error){
        console.log(error.message);
        res.resume();
        return;
    }

    let html = '';
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        html += chunk;
    })

    res.on('end', () => {
        console.log(html)
    })
});