import axios from "axios";
import { GET_ISSUES_OF_REPOSITORY, ADD_STAR } from "./query";

const axiosGitHubGraphQL = axios.create({
  baseURL: "https://api.github.com/graphql",
  headers: {
    Authorization: `bearer ${process.env.REACT_APP_GITHUB_PERSONAL_ACCESS_TOKEN}`,
  },
});

const getIssuesOfRepository = (path, cursor) => {
  const [organization, repository] = path.split("/");

  // Le 1er paramètre de la méthode post de axios est l'URL qui est toujours la même (spécificité de graphql)
  // Par contre le 2ème paramètre qui est la requête graphql peut bien sûr changer à chaque requête.
  // C'est une différence importante avec une API REST où le 1er paramètre correspond à l'entry point.
  // Pour schématiser l'info qui est dans l'entry point dans une API REST et dans la requete en grapql.
  return axiosGitHubGraphQL.post("", {
    query: GET_ISSUES_OF_REPOSITORY,
    variables: { organization, repository, cursor },
  });
};

const addStarToRepository = repositoryId => {
  return axiosGitHubGraphQL.post('', {
    query: ADD_STAR,
    variables: { repositoryId },
  });
}

export { getIssuesOfRepository, addStarToRepository };
