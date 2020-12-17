const Repository = ({ repository }) => {
  return (
    <div>
      <p>
        <strong>In repository</strong>&nbsp;
        <a href={repository.url}>{repository.name}</a>
      </p>
      <ul>
        {repository.issues.edges.map((issue) => (
          <li key={issue.node.id}>
            <a href={issue.node.url}>{issue.node.title}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export { Repository };
