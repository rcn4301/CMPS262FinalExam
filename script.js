var searchBtn = document.getElementById("searchBtn");
var lyrics = document.getElementById("lyrics");
const favoriteBtn = document.querySelector("#favoriteTab");
var lastFmApiKey = "8c532e6fce66c0c0cae9e4ef54fbf478";
var albumDisplay = document.querySelector(".songImg");


favoriteBtn.addEventListener("click", function () {
  const favoriteSection = document.querySelector(".favorites");
  favoriteSection.classList.toggle("slide");
});


$("#closeFavs").on("click", function () {
  const favoriteSection = document.querySelector(".favorites");
  favoriteSection.classList.remove("slide");
});

const form = document.querySelector("#form");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  if (!form.checkValidity()) {
    $("#valMessage").removeClass("hide");
    return;
  }
  $("#valMessage").addClass("hide");
  $("#heart").removeClass("fas");
  $("#heart").addClass("far");
  var button = $(this);
  var song = button.siblings("#song").val();
  var artist = button.siblings("#artist").val();
  $(".songImg").addClass("animateImg");
  localStorage.setItem("song", song.trim());
  localStorage.setItem("artist", artist.trim());
  getLyricsApi(song, artist);
  getFmApi(song, artist);
  displayName(song, artist);
});

$("#heartBtn").on("click", function () {
  var song = encodeURIComponent(localStorage.getItem("song"));
  var artist = encodeURIComponent(localStorage.getItem("artist"));
  var heartButton = $("#heart");

  heartButton.removeClass("far");
  heartButton.addClass("fas");
  var newButton = $("<button>");
  newButton.attr("id", "fav");
  newButton.data("song", song);
  newButton.data("artist", artist);
  newButton.text(
    titleCase(decodeURIComponent(song)) +
      " by " +
      titleCase(decodeURIComponent(artist))
  );
  $(".favList").append(newButton);

  var songArray = JSON.parse(localStorage.getItem("songInfo")) || [];
  songArray.push({
    song: song,
    artist: artist,
  });
  localStorage.setItem("songInfo", JSON.stringify(songArray));
});

//Functions

function getFmApi(song, artist) {
  var requestUrl =
    "https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=" +
    lastFmApiKey +
    "&artist=" +
    artist +
    "&track=" +
    song +
    "&format=json";
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var albumCover;
      if (data.track.album) {
        albumCover = data.track.album.image[3]["#text"];
        albumDisplay.src = albumCover;
      }

      if (!albumCover) {
        albumDisplay.src = "./assets/images/mic.jpg";
      }
    });
}

function kanye() {
  $.ajax({
    url: "https://api.kanye.rest",
    method: "GET",
  }).then(function (data) {
    lyrics.innerHTML =
      "Sorry, we didn't find any lyrics but here's a nice quote from Kanye!<br> " +
      '"' +
      data.quote +
      '"<br> - Kanye West';
    if (albumDisplay.src.includes("mic.jpg")) {
      albumDisplay.src = "./assets/images/kanye-west.jpg";
    }
  });
}

function getLyricsApi(song, artist) {
  var requestUrl = "https://api.lyrics.ovh/v1/" + artist + "/" + song;
  fetch(requestUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      if (data.lyrics === "") {
        kanye();
      } else {
        lyrics.innerText = data.lyrics;
      }
    });
}

function displayName(song, artist) {
  document.getElementById("songNameDisplay").innerText =
    titleCase(song) + " by " + titleCase(artist);
}

function titleCase(str) {
  return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

function displayStorage() {
  var songArray = JSON.parse(localStorage.getItem("songInfo")) || [];
  for (var i = 0; i < songArray.length; i++) {
    var newButton = $("<button>");
    newButton.attr("id", "fav");
    newButton.data("song", songArray[i].song);
    newButton.data("artist", songArray[i].artist);
    var favSong = decodeURIComponent(songArray[i].song);
    var favArtist = decodeURIComponent(songArray[i].artist);
    newButton.text(titleCase(favSong) + " by " + titleCase(favArtist));
    $(".favList").append(newButton);
    console.log(songArray[i]);
  }
}

$(document).on("click", "#fav", function () {
  $("#heart").removeClass("far");
  $("#heart").addClass("fas");
  var song = $(this).data("song");
  var artist = $(this).data("artist");
  $(".songImg").addClass("animateImg");
  getLyricsApi(song, artist);
  getFmApi(song, artist);
  displayName(decodeURIComponent(song), decodeURIComponent(artist));
});

$(".clear").on("click", function () {
  localStorage.clear();
  $(".favList").empty();
});

displayStorage();
