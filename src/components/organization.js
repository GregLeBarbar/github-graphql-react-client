import { Repository } from "./repository";

const Organization = ({ organization, errors }) => {
  if (errors) {
    return (
      <p>
        <strong>Something went strong:</strong>&nbsp;
        {errors.map((error) => error.message).join("")}
      </p>
    );
  }
  return (
    <div>
      <p>
        <strong>Issues from Organization</strong>&nbsp;
        <a href={organization.url}>{organization.name}</a>
      </p>
      <Repository repository={organization.repository} />
    </div>
  );
};

export { Organization };
