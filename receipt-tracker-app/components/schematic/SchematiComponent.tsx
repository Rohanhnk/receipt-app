import { getTemporaryAccessToken } from "@/actions/getTemporaryAccessToken";
import SchematicEmbed from "./SchematicEmbed";

async function SchematicComponent({ componentId }: { componentId: string }) {
  if (!componentId) {
    return null;
  }

  // Debug: log componentId coming into the server component
  console.log("SchematicComponent: componentId =", componentId);

  const accessToken = await getTemporaryAccessToken();

  // Debug: log whether an access token was returned
  console.log("SchematicComponent: accessToken present =", !!accessToken);

  if (!accessToken) {
    throw new Error("No access token available");
  }

  return <SchematicEmbed accessToken={accessToken} componentId={componentId} />;
}

export default SchematicComponent;
