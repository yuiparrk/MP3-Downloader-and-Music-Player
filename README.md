Frontend (HTML, JavaScript, CSS):
- Recieves Youtube URL and sends it to backend
- Streams the converted MP3 file using HTML audio player
- Displays a playlist of all the songs with previous and next options
- Updates the playlist dynamically

Backend (Python, Flask)
- Recieves the URL from frontend
- Downloads the audio with pytubefix package and converts it to MP3 format
- Stores the file in downloads folder

Installation Guide:

git clone https://github.com/yuiparrk/MP3-Downloader-and-Music-Player.git

cd mp3-streamer

python -m venv venv

pip install Flask pytubefix

python server.py
