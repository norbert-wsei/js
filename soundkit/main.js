document.addEventListener('DOMContentLoaded', appStart);

const channels = {
  'channel1': [],
  'channel2': [],
  'channel3': [],
  'channel4': [],
};

const sounds = {
  97: 'boom',
  115: 'clap',
  100: 'hihat',
  102: 'kick',
  103: 'openhat',
  104: 'ride',
  106: 'snare',
  107: 'tink',
  108: 'tom',
}

let isRecording = false;
let recStart = 0;
let currentChannel = 'channel1';

function appStart() {
  window.addEventListener('keypress', playSound);
  document.querySelector('#rec').addEventListener('click', recAudio);
  document.querySelector('#play').addEventListener('click', playAudio);
  document.querySelectorAll('input[name=channel]').forEach(radioElement => {
    radioElement.addEventListener('change', changeChannel);
  });
}

function changeChannel(event) {
  currentChannel = event.target.value;
}

function playAudio() {

  Object
    .values(channels)
    .forEach(channel => {
      channel.forEach(sound => {
        setTimeout(() => {
          const audioDOM = document.querySelector(`#${sound.name}`);
          audioDOM.currentTime = 0;
          audioDOM.play();
        }, sound.time);
      });
    });
}

function recAudio(event) {
  recStart = Date.now();
  isRecording = !isRecording;
  event.target.innerHTML = isRecording ? 'Stop' : 'Nagrywaj';
}

function playSound(event) {
  if (!sounds.hasOwnProperty(event.charCode)) {
    return;
  }

  const soundName = sounds[event.charCode];
  const audioDOM = document.querySelector(`#${soundName}`);
  audioDOM.currentTime = 0;
  audioDOM.play();

  if (isRecording) {
    channels[currentChannel].push({
      name: soundName,
      time: Date.now() - recStart
    })
  }
}