const http = require('https');
const cheerio = require('cheerio');
const fs = require('fs');

const getPageItems = (html) => {
    const $ = cheerio.load(html);
    let url = $('meta[property="og:url"]').attr('content');
    let author = '';
    let bodyText = '';
    let type = 'article'
    if( url.search('ted.com') !== -1 ){
        author = $('meta[name="author"]').attr('content');
        type = 'video'
        $('.Grid__cell p').each( (index, element) => {
            bodyText += $(element).text();
        })
        bodyText = bodyText.replace(/[\t\n]+/g,' ');
    }else if ( url.search('olhardigital.com') !== -1 ) {
        author = $('.meta-aut').text();
        bodyText = $('.mat-txt > p').text();
    }else{
        author = $('.title-single__info__author__about__name a').text();
        $('.content-single__sidebar-content__content span').each( (index, element) => {

            //não concatena o elemento que tiver um filho com a tag <em>, pois não faz parte do texto do artigo
            if( !$(element).find('em').length )
                bodyText += $(element).text()
        })
    }
    
    return {
        'author' : author,
        'body' : bodyText,
        'title' : $('meta[property="og:title"]').attr('content'),
        'type' : type,
        'url' : url
    };    
}

const formatNameFile = (title) => {
    let name = title.normalize("NFD").toLowerCase();
    name = name.replace(/[-!@—_#$%^&*(),.?:{}|<>\u0300-\u036f]/g, '');
    name = name.replace(/\W/g,'-') + '.json';
    return name;
}

const createFileJSON = (html) => {
    let obj = getPageItems(html);
    let nameFile = formatNameFile(obj['title']);
    fs.writeFile("./json/"+nameFile, JSON.stringify(obj, null, 2), (e) => {
        if( e )
            return console.log(`Ocorreu um erro ao criar o arquivo JSON\n${e.message}`);
    });
}

const callbackRequest = (res) => {
    if( res.statusCode != 200){
        let error = new Error(`Falha na requisição\nStatus Code: ${res.statusCode}`);
        console.log(error.message);
        res.resume();
        return;
    }
    let html = '';
    if( res.headers['content-type'].search('ISO-8859-1') !== -1 )
        res.setEncoding('latin1');
    else
        res.setEncoding('utf-8');
    res.on('data', (chunk) => {
        html += chunk;
    })

    res.on('end', () => {
        createFileJSON(html);
    })
};

const readFileTXT = (url) => {
    let bodyFile = fs.readFileSync(url , {encoding: 'utf-8', flag: 'r'});
    return bodyFile.split(/[\r\n]+/g);
}

for (const url of readFileTXT('lista-sites.txt')) {
    http.get(url, callbackRequest);
}