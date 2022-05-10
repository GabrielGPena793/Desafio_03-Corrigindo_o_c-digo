const express = require("express");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());

//middleware
function checkIfExistsRepository(request, response, next){
  const { id } = request.params;

  let repository = repositories.find(repository => repository.id === id);

  if (!repository) {
    return response.status(404).json({ "error": "Repository not found" });
  }

  request.repository = repository;
  return next();
}

let repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", checkIfExistsRepository, (request, response) => {
  const {title, url, techs} = request.body;
  let { repository } = request;

  repository = { ...repository, title, url, techs };
  
  return response.status(201).json(repository);
});

app.delete("/repositories/:id", checkIfExistsRepository, (request, response) => {
  const { repository } = request;

  repositories = repositories.filter(repo => repo != repository);

  return response.status(204).send();
});

app.post("/repositories/:id/like", checkIfExistsRepository, (request, response) => {
  const { repository } = request;

  repository.likes = repository.likes + 1;

  return response.json(repository);
});

module.exports = app;
