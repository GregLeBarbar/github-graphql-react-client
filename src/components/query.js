const GET_ISSUES_OF_REPOSITORY = `
{
  organization(login: "epfl-si") {
    name
    url
    repository(name: "wp-veritas") {
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

export { GET_ISSUES_OF_REPOSITORY };
