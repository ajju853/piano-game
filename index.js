const piano = document.getElementById('piano');
const noteDisplay = document.getElementById('noteDisplay');
const songSelect = document.getElementById('songSelect');
const playButton = document.getElementById('playButton');
const volumeControl = document.getElementById('volumeControl');
const tempoControl = document.getElementById('tempoControl');
const themeToggle = document.getElementById('themeToggle');

const notes = [
  { note: 'C', freq: 261.63, color: 'white', key: 'a' },
  { note: 'C#', freq: 277.18, color: 'black', key: 'w' },
  { note: 'D', freq: 293.66, color: 'white', key: 's' },
  { note: 'D#', freq: 311.13, color: 'black', key: 'e' },
  { note: 'E', freq: 329.63, color: 'white', key: 'd' },
  { note: 'F', freq: 349.23, color: 'white', key: 'f' },
  { note: 'F#', freq: 369.99, color: 'black', key: 't' },
  { note: 'G', freq: 392.00, color: 'white', key: 'g' },
  { note: 'G#', freq: 415.30, color: 'black', key: 'y' },
  { note: 'A', freq: 440.00, color: 'white', key: 'h' },
  { note: 'A#', freq: 466.16, color: 'black', key: 'u' },
  { note: 'B', freq: 493.88, color: 'white', key: 'j' }
];

const songs = {
  twinkle: ['C', 'C', 'G', 'G', 'A', 'A', 'G', 'F', 'F', 'E', 'E', 'D', 'D', 'C'],
  happy: ['C', 'C', 'D', 'C', 'F', 'E', 'C', 'C', 'D', 'C', 'G', 'F'],
  ode: ['C', 'E', 'F', 'G', 'C', 'E', 'F', 'G', 'C', 'E', 'F', 'G']
};

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let currentVolume = 0.5;

notes.forEach(noteObj => {
  const key = document.createElement('div');
  key.className = `key ${noteObj.color}`;
  key.dataset.note = noteObj.note;
  key.dataset.freq = noteObj.freq;
  piano.appendChild(key);

  key.addEventListener('mousedown', playNote);
  key.addEventListener('mouseup', stopNote);
  key.addEventListener('mouseleave', stopNote);
});

function createSound(frequency) {
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.type = 'sine';
  oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
  gainNode.gain.setValueAtTime(currentVolume, audioContext.currentTime);

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 1.5);
}

function playNoteByKey(note) {
  const key = getKeyByNote(note);
  if (key) {
    playNote({ target: key });
  }
}

function playNote(e) {
  const freq = parseFloat(e.target.dataset.freq);
  const note = e.target.dataset.note;

  createSound(freq);
  e.target.classList.add('active');
  noteDisplay.textContent = `Current Note: ${note} | Volume: ${currentVolume}`;
}

function stopNote(e) {
  e.target.classList.remove('active');
}

function getKeyByNote(note) {
  return Array.from(piano.children).find(key => key.dataset.note === note);
}

function playSong(song) {
  let index = 0;
  const tempo = parseInt(tempoControl.value);
  const interval = setInterval(() => {
    if (index < song.length) {
      const key = getKeyByNote(song[index]);
      if (key) {
        playNote({ target: key });
        setTimeout(() => stopNote({ target: key }), 400);
      }
      index++;
    } else {
      clearInterval(interval);
    }
  }, tempo);
}

playButton.addEventListener('click', () => {
  const selectedSong = songSelect.value;
  if (selectedSong && songs[selectedSong]) {
    playSong(songs[selectedSong]);
  }
});

volumeControl.addEventListener('input', (e) => {
  currentVolume = e.target.value;
  noteDisplay.textContent = `Current Note: ${noteDisplay.textContent.split(': ')[1]} | Volume: ${currentVolume}`;
});

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.body.classList.toggle('dark-theme', savedTheme === 'dark');
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-theme');
  localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
});

document.addEventListener('keydown', (e) => {
  const noteObj = notes.find(note => note.key === e.key);
  if (noteObj) {
    playNoteByKey(noteObj.note);
  }
});