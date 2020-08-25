const http = require('https');
const cheerio = require('cheerio')

const url = new URL('https://www.startse.com/noticia/startups/mobtech/deep-learning-o-cerebro-dos-carros-autonomos');
//const url = new URL('https://olhardigital.com.br/colunistas/wagner_sanchez/post/os_riscos_do_machine_learning/80584');
//const url = new URL('https://www.ted.com/talks/tom_gruber_how_ai_can_enhance_our_memory_work_and_social_lives/transcript?language=pt-br');

const getPageItems = (html) => {
    const $ = cheerio.load(html);
    let url = $('meta[property="og:url"]').attr('content');
    let author = '';
    let bodyText = '';
    if( url.search('ted.com') !== -1 ){
        author = $('meta[name="author"]').attr('content');
        $('.Grid__cell p').each( (index, element) => {
            bodyText += $(element).text();
        })
    }else if ( url.search('olhardigital.com') !== -1 ) {
        author = $('.meta-aut').text();

        //No html, há uma marcação de JSON-LD onde há uma key "articleBody" em que recebe todo o texto do artigo
        //Então como o parâmetro html é uma string, bodyText recebe um "corte" dela, a partir do começo de value da key "articleBody"
        bodyText = html.slice(html.search("articleBody")+16)

        //String é "cortada" novamente, agora em uma quebra de linha, ficando somente o texto do artigo
        bodyText = bodyText.slice(0, bodyText.search('\\n')-3);
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
        'title' : $('meta[property="og:type"]').attr('content').replace('.other',''),
        'type' : $('meta[property="og:title"]').attr('content'),
        'url' : url
    };    
}

const createFileJSON = (html) => {
    console.log(getPageItems(html));
}

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
        createFileJSON(html);
    })
});