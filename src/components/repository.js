const Repository = ({ repository }) => {
  return (
    <div>
      <p>
        <strong>In repository</strong>&nbsp;
        <a href={repository.url}>{repository.name}</a>
      </p>
    </div>
  );
};

export { Repository };
