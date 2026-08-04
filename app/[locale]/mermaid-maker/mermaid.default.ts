export const DEFAULT_MERMAID: string = `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Keep trying]
    C --> E[End]
    D --> B`;
