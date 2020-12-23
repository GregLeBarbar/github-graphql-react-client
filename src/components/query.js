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
      id
      name
      url
      stargazers {
        totalCount
      }
      viewerHasStarred
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

// https://docs.github.com/en/free-pro-team@latest/graphql/reference/mutations#addstar
// Avec le lien ci-dessus (et les liens référencés dans cette page), on peut comprendre
// comment on a définit les différents éléments de cette mutation
const ADD_STAR = `
  mutation ($repositoryId: ID!) {
    addStar(input:{starrableId:$repositoryId}){
      starrable {
        viewerHasStarred
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

const resolveAddStarMutation = (mutationResult) => (state) => {
  // When resolving the promise from the mutation, you can find out about the viewerHasStarred
  // property in the result. That’s because you defined this property as a field in your mutation.
  // It returns a new state object for React’s local state, because you used the function in this.setState().
  const { viewerHasStarred } = mutationResult.data.data.addStar.starrable;

  const { totalCount } = state.organization.repository.stargazers;

  // The spread operator syntax is used here, to update the deeply nested data structure.
  // Only the viewerHasStarred property changes in the state object, because it’s the only
  // property returned by the resolved promise from the successful request.
  // All other parts of the local state stay intact.
  return {
    ...state,
    organization: {
      ...state.organization,
      repository: {
        ...state.organization.repository,
        viewerHasStarred,
        stargazers: {
          totalCount: totalCount + 1,
        },
      },
    },
  };
};

export {
  GET_ISSUES_OF_REPOSITORY,
  ADD_STAR,
  resolveIssuesQuery,
  resolveAddStarMutation,
};
