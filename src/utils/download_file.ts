import { generateSQLFromSchemas } from "./schemaToSQL";
import { SchemaJsonObject } from "./stores/chat_store";

export const downloadJSON = (data: unknown, filename = "schema.json") => {
  const fileData = JSON.stringify(data, null, 2);
  const blob = new Blob([fileData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadSQL = (
  data: SchemaJsonObject[],
  filename = "schema.sql"
) => {
  try {
    const sql = generateSQLFromSchemas(data);
    const blob = new Blob([sql], { type: "text/sql" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error exporting SQL:", error);
  }
};
