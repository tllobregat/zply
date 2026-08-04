import React from 'react';
import { Activity, Share2, Workflow, BarChart } from 'lucide-react';
import { MermaidSnippetGroup } from './mermaid.types';

export const getSnippetGroups = (_t: (key: string) => string): MermaidSnippetGroup[] => [
  {
    id: 'flowchart',
    icon: <Activity className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicFlow',
        content: `graph TD
    A[Start] --> B{Is it working?}
    B -- Yes --> C[Great!]
    B -- No --> D[Keep trying]
    C --> E[End]
    D --> B`
      }
    ]
  },
  {
    id: 'sequence',
    icon: <Share2 className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicSequence',
        content: `sequenceDiagram
    Alice->>John: Hello John, how are you?
    John-->>Alice: Great!
    Alice-)John: See you later!`
      }
    ]
  },
  {
    id: 'class',
    icon: <Workflow className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicClass',
        content: `classDiagram
    Animal <|-- Duck
    Animal <|-- Fish
    Animal <|-- Zebra
    Animal : +int age
    Animal : +String gender
    Animal: +isMammal()
    Animal: +mate()
    class Duck{
        +String beakColor
        +swim()
        +quack()
    }
    class Fish{
        -int sizeInFeet
        -canEat()
    }
    class Zebra{
        +bool is_wild
        +run()
    }`
      }
    ]
  },
  {
    id: 'gantt',
    icon: <BarChart className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicGantt',
        content: `gantt
    title A Gantt Diagram
    dateFormat  YYYY-MM-DD
    section Section
    A task           :a1, 2024-01-01, 30d
    Another task     :after a1  , 20d
    section Another
    Task in Another  :2024-01-12  , 12d
    another task      : 24d`
      }
    ]
  }
];
