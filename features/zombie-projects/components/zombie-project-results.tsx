import ZombieProjectList from "./zombie-project-list";
import ZombieProjectSearchResults from "./zombie-project-search-results";

interface ZombieProjectResultsProps {
  query: string;
}

export default function ZombieProjectResults({
  query,
}: ZombieProjectResultsProps) {
  return query ? (
    <ZombieProjectSearchResults query={query} />
  ) : (
    <ZombieProjectList />
  );
}
