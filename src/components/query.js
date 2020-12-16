const GET_ORGANIZATION = `
{
  organization(login: "epfl-si") {
    name
    url
  }
}
`;

export { GET_ORGANIZATION };
