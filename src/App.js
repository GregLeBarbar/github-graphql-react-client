import React, { Component } from "react";
import { axiosGitHubGraphQL } from "./components/axios";
import { getIssuesOfRepositoryQuery } from "./components/query";
import { Organization } from "./components/organization";

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

  onFetchFromGitHub = (path) => {
    const [organization, repository] = path.split("/");

    axiosGitHubGraphQL
      .post("", { query: getIssuesOfRepositoryQuery(organization, repository) })
      .then((result) =>
        // ici la solution du livre est un peu différente.
        // je ne sais pas pourquoi, il préfère retourner
        // une méthode plutôt que directement l'objet
        //
        // this.setState(() => ({
        //   organization: result.data.data.organization,
        //   errors: result.data.errors,
        //   })),

        this.setState({
          organization: result.data.data.organization,
          errors: result.data.errors,
        })
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
          <Organization organization={organization} errors={errors} />
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
