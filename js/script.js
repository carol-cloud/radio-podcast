// window.addEventListener('load', start)
//utilizamos defer ao invés da linha

var inputCurrentFrequency = document.querySelector('#inputCurrentFrequency');
var rangeFrequencies = document.querySelector('#rangeFrequencies');
var divPodcast = document.querySelector('#divPodcast');

function start() {
  rangeFrequencies.addEventListener('input', handRangeValueChange);
}

// Essa função pega a mudança de estação e mostra essa mudança do input
function handRangeValueChange(event) {
  var currentFrequency = event.target.value;
  inputCurrentFrequency.value = currentFrequency;

  findPodcastFrom(currentFrequency);
}
function findPodcastFrom(frequency) {}

function findPodcastFrom(frequency) {
  var foundPodcast = null;

  for (var i = 0; i < realPodcasts.length; i++) {
    var currentPodcast = realPodcasts[i];

    if (currentPodcast.id === frequency) {
      foundPodcast = currentPodcast;
      console.log(foundPodcast);
      break;
    }
  }

  if (foundPodcast) {
    renderPodcast(foundPodcast);
  } else {
    divPodcast.innerHTML = '<p>Nenhum podcast encontrado!</p>';
  }
}

function renderPodcast(podcast) {
  divPodcast.innerHTML = '';

  var img = document.createElement('img');
  img.src = './img/' + podcast.img;

  var title = document.createElement('h2');
  title.textContent = podcast.title;

  var description = document.createElement('p');
  description.textContent = podcast.description;

  
  divPodcast.appendChild(img);
  divPodcast.appendChild(title);
  divPodcast.appendChild(description);
}

start();
