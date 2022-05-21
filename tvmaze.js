"use strict";

const $showsList = $("#shows-list");
const $episodesArea = $("#episodes-area");
const $searchForm = $("#search-form");
const MISSING_IMAGE_URL = "https://tinyurl.com/missing-tv";
const $episodesList = $("#episodes-list");

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  let result = await axios.get(`https://api.tvmaze.com/search/shows?q=${term}`);
  //result.data is going to return an array of t.v shows
  let info1 = result.data;
  //empty array holding different shows
  let allShows = []
  //loop over list of shows and create an object based on the show's info
  for(let i of info1){
    allShows.push(
      {
        //id, name, summary, and image are all found in key=show
        id: i.show.id,
        name: i.show.name,
        summary: i.show.summary,
        image: i.show.image? i.show.image.medium: MISSING_IMAGE_URL
      }
    );
  }
  return allShows;
}

/** Given list of shows, create markup for each and to DOM */

function populateShows(shows) {
  $showsList.empty();

  for (let show of shows) {
    const $show = $(
        `<div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img 
              src="${show.image}" 
              alt="${show.id}"
              class="w-25 mr-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>  
       </div>
      `);

    $showsList.append($show);  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchForShowAndDisplay() {
  const term = $("#search-query").val();
  const ID = parseInt(term);
  if(!ID){
     //return an array of objects
    $showsList.attr("style", "");
    $episodesArea.attr("style", "display: none");
    const shows = await getShowsByTerm(term);
    populateShows(shows);
  }
  else{
    const episodes = await getEpisodesOfShow(term);
    $showsList.attr("style", "display: none");
    populateEpisodes(episodes);
  }
}

$searchForm.on("submit", async function (evt) {
  evt.preventDefault();
  await searchForShowAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) { 
  const result = await axios.get(`https://api.tvmaze.com/shows/${id}/episodes`);
  const episodes = result.data;
  console.log(episodes);
  let episodesList = []
  for (let episode of episodes){
    episodesList.push(
      {
        id: episode.id,
        name: episode.name,
        season: episode.season,
        number: episode.number
      }
    );
  }
  return episodesList;
}

/**
 * function populateEpisodes will populate HTML page with episodes of a specific show(id)
 */

function populateEpisodes(episodes) { 
  $episodesList.empty();
  $episodesArea.attr("style", "");

  for (let episode of episodes){
    const $episode = $(`
      <li> Episode ID: ${episode.id} | Episode Name: ${episode.name} | Episode season: ${episode.season} | Episode number: ${episode.number}</li>
    `);
    $episodesList.append($episode);
  }
}
