const GET_REPOSITORY_OF_ORGANIZATION = `
{
  organization(login: "epfl-si") {
    name
    url
    repository(name: "wp-veritas"){
      name
      url
    }
  }
}
`;

export { GET_REPOSITORY_OF_ORGANIZATION };
