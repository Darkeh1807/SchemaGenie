interface SchemaObject {
  collectionName: string;
  schema: Record<string, string>;
}
type SchemaField =
  | string
  | {
      type: string;
    };

export const jsTypeToSQLType = (type: SchemaField): string => {
  if (typeof type === "object" && type.type) {
    type = type.type;
  }

  if (typeof type !== "string") return "TEXT";

  switch (type.toLowerCase()) {
    case "string":
      return "VARCHAR(255)";
    case "number":
      return "INT";
    case "boolean":
      return "BOOLEAN";
    case "date":
      return "DATE";
    default:
      return "TEXT";
  }
};

export const generateSQLFromSchemas = (schemas: SchemaObject[]): string => {
  return schemas
    .map((collection) => {
      const tableName = collection.collectionName;
      const fields = Object.entries(collection.schema)
        .map(([fieldName, fieldValue]) => {
          const sqlType = jsTypeToSQLType(fieldValue);
          return `  ${fieldName} ${sqlType}`;
        })
        .join(",\n");

      return `CREATE TABLE ${tableName} (\n${fields}\n);`;
    })
    .join("\n\n");
};
