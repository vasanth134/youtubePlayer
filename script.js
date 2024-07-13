const videoCardContainer = document.querySelector(".videoCard");

let api_key = "AIzaSyAchR6Bv7zMdJjT3ayisyW4nrWFBhSNiAA";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";
let search_http = "https://www.googleapis.com/youtube/v3/search?";

// Fetch most popular videos initially
fetch(
  video_http +
    new URLSearchParams({
      key: api_key,
      part: "snippet",
      chart: "mostPopular",
      maxResults: 100,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail =
        data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video_data);
    });
};

const makeVideoCard = (data) => {
  // Handle both types of data structures: popular videos and search results
  const videoId = data.id.videoId ? data.id.videoId : data.id;
  
  videoCardContainer.innerHTML += `
  <div class="video" onclick="location.href='https://www.youtube.com/watch?v=${videoId}'">
    <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
    <div class="content">
      <img src="${data.channelThumbnail}" class="channel-icon" alt="">
      <div class="info">
        <h4 class="title">${data.snippet.title}</h4>
        <p class="channel-name">${data.snippet.channelTitle}</p>
      </div>
    </div>
  </div>
  `;
};

const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchSubmitButton");

const fetchVideos = (query) => {
  fetch(
    search_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        q: query,
        maxResults: 20,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      videoCardContainer.innerHTML = ''; // Clear previous results
      data.items.forEach((item) => {
        if (item.id.kind === "youtube#video") {
          getChannelIcon(item);
        }
      });
    })
    .catch((err) => console.log(err));
};

searchBtn.addEventListener("click", () => {
  if (searchInput.value.length) {
    fetchVideos(searchInput.value);
  }
});
