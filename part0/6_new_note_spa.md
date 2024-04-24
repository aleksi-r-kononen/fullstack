```mermaid
sequenceDiagram
    participant B as Browser
    participant S as Server
    B->>S: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    S->>B: 201 Created
```