const GET_ISSUES_OF_REPOSITORY = `
query (
  $organization: String!,
  $repository: String!,
  $cursor: String
) {
  organization(login: $organization) {
    name
    url
    repository(name: $repository) {
      name
      url
      issues(first: 5, after: $cursor, states: [OPEN]) {
        edges {
          node {
            id
            title
            url
            reactions(last: 3) {
              edges {
                node {
                  id
                  content
                }
              }
            }
          }
        }
        totalCount
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }
}
`;

/**
 * Cette méthode est passée directement à this.setState()
 * Jusqu'à cette étape, on pouvait simplement retourner un objet.
 * Mais, à partir de cette étape, on veut utiliser l'ancien state, passé en paramètre.
 *
 * Rappel: Attention, la mise à jour de state et de props peut être asynchrone !
 * React pour optimiser la mise à jour du DOM procède par pack de mises à jour et
 * donc la mise à jour de state et de props peut être asynchrones.
 * Si vous utilisez props ou state pour définir votre nouveau state avec setState,
 * il faut utiliser une fonction.
 */
const resolveIssuesQuery = (queryResult, cursor) => (state) => {
  const { data, errors } = queryResult.data;

  if (!cursor) {
    return {
      organization: data.organization,
      errors: errors,
    };
  }

  // Les anciennes issues sont dans le state
  // Les nouvelles dans le résulat de la requete
  // On merge les issues dans un tableau
  //
  // A noter la syntaxe:
  // Lorsqu'on décompose un objet, on peut affecter la variable obtenue
  // sur une variable qui possède un autre nom (que celui de la propriété) :
  // Ici, par exemple:
  //
  // const { edges: oldIssues } = state.organization.repository.issues;
  //
  // prend la propriété edges de l'objet state.organization.repository.issues
  // pour l'affecter à une variable locale qui a pour nom 'oldIssues'
  const { edges: oldIssues } = state.organization.repository.issues;
  const { edges: newIssues } = data.organization.repository.issues;
  const updatedIssues = [...oldIssues, ...newIssues];

  return {
    organization: {
      ...data.organization,
      repository: {
        ...data.organization.repository,
        issues: {
          ...data.organization.repository.issues,
          edges: updatedIssues,
        },
      },
    },
    errors,
  };
};

export { GET_ISSUES_OF_REPOSITORY, resolveIssuesQuery };
