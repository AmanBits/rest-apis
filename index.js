const express = require("express");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
let podcasts = JSON.parse(fs.readFileSync("podcasts.json", "utf-8"));

app.use(express.json());

app.get("/podcasts", (req, res) => {
  if (podcasts.length !== 0) return res.status(200).send(podcasts);
  return res.sendStatus(404);
});

app.get("/podcasts/:title", (req, res) => {
  const {
    params: { title },
  } = req;
  const podcast = podcasts.find((podcast) => podcast.title === title);
  if (podcast) return res.status(200).send(podcast);
  return res.sendStatus(404);
});

// In this the object should be same no of fields with same name as suggested
app.post("/podcasts", (req, res) => {
  const { body } = req;

  if (
    typeof body !== "object" ||
    body === null ||
    Object.keys(body).length === 0 ||
    podcasts.some((podcast) => podcast.title === body.title) // To check the body object have same names of fields or not
  )
    return res.sendStatus(400);
  podcasts.push(body);
  fs.writeFileSync("podcasts.json", JSON.stringify(podcasts), "utf-8");
  return res.sendStatus(201);
});

// PUT
app.put("/podcasts/:title", (req, res) => {
  const { body } = req;
  const {
    params: { title },
  } = req;

  if (
    typeof body !== "object" ||
    body === null ||
    Object.keys(body).length === 0
  )
    return res.sendStatus(400);

  const podcastIndex = podcasts.findIndex((podcast) => podcast.title === title);
  console.log(podcastIndex);
  if (!podcastIndex) return res.sendStatus(404);
  podcasts[podcastIndex] = { ...body };
  fs.writeFileSync("podcasts.json", JSON.stringify(podcasts), "utf-8");
  return res.status(201).send(body);
});

app.delete("/podcasts/:title", (req, res) => {
  const {
    params: { title },
  } = req;

  const findpodcast = podcasts.filter((podcast) => podcast.title !== title);
  if (findpodcast.length === podcasts.length) return res.sendStatus(404);
  podcasts = findpodcast;
  fs.writeFileSync("podcasts.json", JSON.stringify(podcasts), "utf-8");
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Podcast is running at port ${PORT}`);
});
