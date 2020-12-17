const GET_ISSUES_OF_REPOSITORY = `
query ($organization: String!, $repository: String!) {
  organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      name
      url
      issues(last: 5) {
        edges {
          node {
            id
            title
            url
          }
        }
      }
    }
  }
}
`;

// ici la solution du livre est un peu différente.
// je ne sais pas pourquoi, il préfère retourner
// une méthode plutôt que directement l'objet
//
// const resolveIssuesQuery = queryResult => () => ({
//   organization: queryResult.data.data.organization,
//   errors: queryResult.data.errors,
// });
const resolveIssuesQuery = (queryResult) => {
  return {
    organization: queryResult.data.data.organization,
    errors: queryResult.data.errors,
  };
};

export { GET_ISSUES_OF_REPOSITORY, resolveIssuesQuery };
