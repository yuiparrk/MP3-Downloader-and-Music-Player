const audioPlayer = document.getElementById("audioPlayer");
const playlist = document.getElementById("playlist");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const downloadBtn = document.getElementById("downloadBtn");
const youtubeUrlInput = document.getElementById("youtubeUrl");

let tracks = []; // Array of {name, url}
let currentTrack = 0; //index

// Fetch songs from server and update playlist
async function fetchSongs() {
  const res = await fetch("/songs");
  const files = await res.json();
  tracks = files.map((f) => ({ name: f, url: `/downloads/${f}` }));
  renderPlaylist();
}

// Render playlist
function renderPlaylist() {
  playlist.innerHTML = "";
  tracks.forEach((track, index) => {
    const li = document.createElement("li");
    li.textContent = track.name;
    li.className = index === currentTrack ? "playing" : "";
    li.addEventListener("click", () => {
      currentTrack = index;
      playTrack(currentTrack);
    });
    playlist.appendChild(li);
  });
}

// Play a song
function playTrack(index) {
  const track = tracks[index];
  if (!track) return;
  audioPlayer.src = track.url;
  audioPlayer.play();
  renderPlaylist();
}

function nextTrack() {
  currentTrack = (currentTrack + 1) % tracks.length;
  playTrack(currentTrack);
}

function prevTrack() {
  currentTrack = (currentTrack - 1 + tracks.length) % tracks.length;
  playTrack(currentTrack);
}

audioPlayer.addEventListener("ended", nextTrack);
nextBtn.addEventListener("click", nextTrack);
prevBtn.addEventListener("click", prevTrack);

// Download from YouTube and add to playlist
downloadBtn.addEventListener("click", async () => {
  const url = youtubeUrlInput.value.trim();
  if (!url) return alert("Enter a YouTube URL");

  const res = await fetch("/download", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  const data = await res.json();
  if (data.filename) {
    await fetchSongs();
    alert(`Downloaded: ${data.filename}`);
    youtubeUrlInput.value = "";
  } else {
    alert("Download failed");
  }
});

fetchSongs();
