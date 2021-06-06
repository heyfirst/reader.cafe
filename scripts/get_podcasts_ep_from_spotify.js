const axios = require('axios');
var fs = require('fs');

const get_poodcasts_ep_from_spotify = async () => {
  let episode = [];
  let total = 0;
  let offset = 0;
  let limit = 50;
  const context = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${process.env.SPOTIFY_ACCESS_TOKEN}`,
    },
  };

  // get total episode
  const response = await axios.get(
    `https://api.spotify.com/v1/shows/1ivUJ4BDOY8iSQqlK2OZf0/episodes?market=th&offset=${offset}&limit=${limit}`,
    context
  );

  total = response.data.total;
  episode = [
    ...episode,
    ...response.data.items,
  ];

  while (offset < total) {
    offset = offset + 50;

    const response = await axios.get(
      `https://api.spotify.com/v1/shows/1ivUJ4BDOY8iSQqlK2OZf0/episodes?market=th&offset=${offset}&limit=${limit}`,
      context
    );

    episode = [...episode, ...response.data.items];
  }

  var json = JSON.stringify({ episode: episode }, null, 2);

  fs.writeFile('./data/podcasts.json', json, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been created');
  });
};

get_poodcasts_ep_from_spotify();
