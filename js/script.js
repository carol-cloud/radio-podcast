// window.addEventListener('load', start)
//utilizamos defer ao invés da linha
/*
há dois "players" de áudio na página. Um deles toca o chiado, e o outro o podcast. 
Sempre que um podcast é sintonizado o volume do player que toca o chiado diminui.
Ao abrir o programa muitas vezes ele começa a falhar. Isso acontece porque ele está
utilizando uma API para driblar o CORS, já que, originalmente, não há como fazer uma
requisição de FEED utilizando apenas javascript local. O que essa API faz é a realizar
a requisição para nós e nos retornar a resposta. O problema é que existe um limite
de requisições por hora que se pode fazer para esta API. 
Ela está descrita no fetch da linha 151.
*/

var inputCurrentFrequency = document.querySelector('#inputCurrentFrequency');
var rangeFrequencies = document.querySelector('#rangeFrequencies');
var divPodcast = document.querySelector('#divPodcast');
var divPlayer = document.querySelector('#divPlayer');
var divPlayingNow = document.querySelector('#divPlayingNow');
var htmlButtons = document.querySelectorAll('button');
var recordMode = false;
var htmlBadAudio = document.querySelector('#badAudio'); //esto objeto se refere ao player oculto tocando o chiado
htmlBadAudio.volume =0.5; 

function start() {  
  syncPodcastsUrls();
  insertButtonEvents(); 
  rangeFrequencies.addEventListener('input', handRangeValueChange);
}

//esta função serve apenas para inserir os eventos nos botões de memorização
function insertButtonEvents(){
  let recordFrequency;

  for(var i = 0; i < htmlButtons.length; i++){

    htmlButtons[i].addEventListener('mousedown', (e)=>{
      recordMode = false;
      e.target.setAttribute('class', 'btn-recording');
      recordFrequency = setTimeout(function() 
      { 
        recordMode = true;
        e.target.value = rangeFrequencies.value;
        e.target.setAttribute('class', 'btn-recorders-on');    
      }, 2000);    
    });

    htmlButtons[i].addEventListener('mouseup', (e)=>{
      clearTimeout(recordFrequency);
      if(e.target.value){
        e.target.setAttribute('class', 'btn-recorders-on');
      }else{
        e.target.setAttribute('class', '');
      }
    });
  
    htmlButtons[i].addEventListener('click', (e)=>{
      if(e.target.value && recordMode == false){
      rangeFrequencies.value = e.target.value;
      inputCurrentFrequency.value = e.target.value+ ' MHz';
      findPodcastFrom(e.target.value);
      }
      else{
        return;
      }
    })
  }
}

// Essa função pega a mudança de estação e mostra essa mudança do input
async function handRangeValueChange(event) {
  divPlayer.innerHTML = '';
  divPlayingNow.innerHTML = '';
  var currentFrequency = event.target.value;
  inputCurrentFrequency.value = currentFrequency+ ' MHz';

  findPodcastFrom(currentFrequency);
}

//essa função encontra o Podcast
function findPodcastFrom(frequency) {
  var foundPodcast = null;

  for (var i = 0; i < realPodcasts.length; i++) {
    var currentPodcast = realPodcasts[i];

    if (currentPodcast.id === frequency) {
      foundPodcast = currentPodcast;
      htmlBadAudio.volume = 0.1;
      break;
    }
  }

  if (foundPodcast) {
    renderPodcast(foundPodcast);
  } else {
    divPodcast.innerHTML = '<p class="blink">Nenhum podcast encontrado!</p>';
    htmlBadAudio.volume= 0.5;
    htmlBadAudio.muted = false;
  }
}

//está função renderiza a área mutável da tela quando um podcast é encontrado.
function renderPodcast(podcast) {
  divPodcast.innerHTML = '';
  divPlayingNow.innerHTML = '';

  var img = document.createElement('img');
  img.src = './img/' + podcast.img;

  var title = document.createElement('h2');
  title.textContent = podcast.title;

  var description = document.createElement('p');
  description.textContent = podcast.description;

  var loading = document.createElement('p');
  var theme = document.createElement('p');
  loading.textContent = 'Sintonizando conteúdo....';
  divPlayer.appendChild(loading);
 
  divPlayer.innerHTML = '';
  
  divPlayer.appendChild(loading);
  var player = document.createElement('audio');
  player.setAttribute('src', podcast.url);
  player.setAttribute('preload','"auto"');
  player.setAttribute('controls', '');
  player.setAttribute('autoplay', '');
  loading.textContent = 'Sintonizado!';
  theme.textContent = podcast.theme;
  
  divPlayer.appendChild(player); 
  divPlayingNow.appendChild(theme); 
  divPodcast.appendChild(img);
  divPodcast.appendChild(title);
  divPodcast.appendChild(description);
}

/*essa função é que salva as urls dos podcasts atuais no vetor de podcasts.
*/
async function syncPodcastsUrls(){
  for (var i = 0; i < realPodcasts.length; i++) {
    let feed = await getFeed(realPodcasts[i]);
    realPodcasts[i].url = getUrl(feed);
    realPodcasts[i].theme = getTheme(feed);
  }
}

//faz a requisição da página de feed do podcast e transforma essa página em um objeto xml
async function getFeed(podcast){
  const feed_url = await fetch('https://cors-anywhere.herokuapp.com/'+podcast.rss);
  const response = await feed_url.text();
  const feed = new window.DOMParser().parseFromString(response, "text/xml");
  return feed;
}

//pega o objeto xml retornado da função acima, e retorna a url do ultimo podcast
function getUrl(feed){
  const tag = feed.querySelector('item > enclosure');
  const url = tag.getAttribute('url');
  return url;
}

//pega o objeto xml retornado e retorna o tema do podcast
function getTheme(feed){
  const tag = feed.querySelector('item > title');
  const theme = tag.textContent;
  return theme;
}

start();
