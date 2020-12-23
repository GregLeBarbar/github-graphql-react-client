import React, { Component } from "react";
import { getIssuesOfRepository } from "./components/axios";
import { Organization } from "./components/organization";
import { resolveIssuesQuery } from "./components/query";

class App extends Component {
  // Au lieu de définir l'état dans le constructeur
  // https://github.com/the-road-to-learn-react/react-alternative-class-component-syntax
  state = {
    path: "epfl-si/wp-veritas",
    organization: null,
    errors: null,
  };

  // La méthode componentDidMount du cycle de vie de React
  // est l'endroit idéal pour faire les appels aux données
  componentDidMount() {
    // fetch data
    this.onFetchFromGitHub(this.state.path);
  }

  onFetchFromGitHub = (path, cursor) => {
    getIssuesOfRepository(path, cursor).then((queryResult) =>
      this.setState(resolveIssuesQuery(queryResult, cursor))
    );
  };

  onSubmit = (event) => {
    this.onFetchFromGitHub(this.state.path);

    // Ceci permet d'empêcher le comportement par défaut de l'événement
    // cad la soumission du formulaire sur l'événement submit
    event.preventDefault();
  };

  /**
   * La méthode onChange permet de mettre à jour l'état du composant
   * dès que l'utilisateur modifie la valeur de champ organisation/repository.
   */
  onChange = (event) => {
    // event.target.value permet de récupérer la valeur de champ organisation/repository.
    this.setState({
      path: event.target.value,
    });
  };

  onFetchMoreIssues = () => {
    const { endCursor } = this.state.organization.repository.issues.pageInfo;

    this.onFetchFromGitHub(this.state.path, endCursor);
  };

  render() {
    const { path, organization, errors } = this.state;
    const TITLE = "React GrapQL Github Client";
    return (
      <div>
        <h1>{TITLE}</h1>
        <form onSubmit={this.onSubmit}>
          <label htmlFor="url">Show open issues for https://github.com/</label>
          <input
            id="url"
            type="text"
            value={path}
            onChange={this.onChange}
            style={{ width: "300px" }}
          />
          <button type="submit">Search</button>
        </form>
        <hr />
        {organization ? (
          <Organization
            organization={organization}
            errors={errors}
            onFetchMoreIssues={this.onFetchMoreIssues}
          />
        ) : (
          <p>No information yet...</p>
        )}
        <hr />
        {/* Afficher l'état du composant: */}
        <div>
          <pre>{JSON.stringify(this.state, null, 2)}</pre>
        </div>
      </div>
    );
  }
}

export default App;
