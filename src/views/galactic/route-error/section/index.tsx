import { Error404Content } from "../../error404/section";

const RouteErrorContent = ({ description }: { description: string }) => (
  <Error404Content description={description} />
);

export { RouteErrorContent };
