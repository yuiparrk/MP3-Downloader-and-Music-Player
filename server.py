from flask import Flask, send_from_directory, jsonify, request
from pytubefix import YouTube
from pytubefix.cli import on_progress
import os  # folder stuff

app = Flask(__name__)  # flask intialize
DOWNLOAD_FOLDER = "downloads"
os.makedirs(DOWNLOAD_FOLDER, exist_ok=True)  # makes a folder to put music in


# connect to the html file
@app.route("/")
def index():
    return send_from_directory(".", "index.html")


# this part is basically jsut documentation
@app.route("/download", methods=["POST"])
def download_mp3():
    url = request.json.get("url")
    if not url:
        return jsonify({"error": "No URL provided"}), 400

    yt = YouTube(url, on_progress_callback=on_progress)
    ys = yt.streams.filter(only_audio=True).first()
    out_file = ys.download(output_path=DOWNLOAD_FOLDER)

    base, ext = os.path.splitext(out_file)
    new_file = base + ".mp3"
    os.rename(out_file, new_file)

    return jsonify({"filename": os.path.basename(new_file)})


# lists all the mp3 files in downlads folder
@app.route("/songs")
def list_songs():
    files = [f for f in os.listdir(DOWNLOAD_FOLDER) if f.endswith(".mp3")]
    return jsonify(files)


# sends the mp3 files from downloads folder to browser
@app.route("/downloads/<path:filename>")
def serve_file(filename):
    return send_from_directory(DOWNLOAD_FOLDER, filename)


if __name__ == "__main__":
    app.run(debug=True)
