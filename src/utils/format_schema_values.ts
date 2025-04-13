export const formatSchemaValue = (
    value: string | number | boolean | { 
      type?: string; 
      enum?: string[]; 
      default?: string | number | boolean 
    } | null
  ): string => {
    if (typeof value === "object" && value !== null) {
      if ("type" in value && "enum" in value && Array.isArray(value.enum)) {
        return `${value.type} (enum: ${value.enum.join(", ")})${
          value.default ? ` | default: ${value.default}` : ""
        }`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };