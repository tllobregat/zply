import React from 'react';
import { FileCode, Activity, Share2, Database, Box, Workflow } from 'lucide-react';
import { PlantUmlSnippetGroup } from './plantuml.types';

export const SNIPPET_GROUPS: PlantUmlSnippetGroup[] = [
  {
    label: 'Sequence Diagram',
    icon: <Activity className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Basic Request/Response',
        content: `@startuml
Alice -> Bob: Authentication Request
Bob --> Alice: Authentication Response

Alice -> Bob: Another authentication Request
Alice <-- Bob: Another authentication Response
@enduml`
      },
      {
        label: 'With Lifelines & Activation',
        content: `@startuml
actor User
participant "WebApp" as A
participant "API" as B

activate User
User -> A: Click login
activate A
A -> B: POST /login
activate B
B --> A: 200 OK (token)
deactivate B
A --> User: Logged in
deactivate A
@enduml`
      },
      {
        label: 'Alt/Opt/Loop Blocks',
        content: `@startuml
participant Client
participant Server

Client -> Server: Request
alt success
  Server --> Client: 200 OK
else error
  Server --> Client: 4xx/5xx
end

opt Retry
  loop 3 times
    Client -> Server: Retry request
    Server --> Client: Response
  end
end
@enduml`
      },
    ],
  },
  {
    label: 'Class Diagram',
    icon: <Share2 className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Basic Classes & Composition',
        content: `@startuml
class Car {
  - String model
  - int year
  + void drive()
}

class Engine {
  - int horsepower
}

Car *-- Engine
@enduml`
      },
      {
        label: 'Inheritance & Interfaces',
        content: `@startuml
interface Repository {
  + save(entity)
  + findById(id)
}

abstract class BaseEntity {
  + id: UUID
}

class User extends BaseEntity {
  + name: String
}

class UserRepository implements Repository

UserRepository ..|> Repository
User --|> BaseEntity
@enduml`
      },
      {
        label: 'Associations & Multiplicity',
        content: `@startuml
class Order
class OrderLine
class Product

Order "1" o-- "*" OrderLine
OrderLine "*" --> "1" Product
@enduml`
      },
    ],
  },
  {
    label: 'Use Case Diagram',
    icon: <FileCode className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Actors & Basic Use Cases',
        content: `@startuml
left to right direction
actor "Food Critic" as fc
rectangle Restaurant {
  usecase "Eat Food" as UC1
  usecase "Pay for Food" as UC2
  usecase "Drink" as UC3
}
fc --> UC1
fc --> UC2
fc --> UC3
@enduml`
      },
      {
        label: 'Include/Extend',
        content: `@startuml
actor Customer
actor Admin

usecase "Place Order" as U1
usecase "Pay" as U2
usecase "Validate Cart" as U3
usecase "Refund" as U4

U1 .> U3 : <<include>>
U1 .> U2 : <<include>>
U4 .> U2 : <<extend>>
Customer --> U1
Admin --> U4
@enduml`
      },
    ],
  },
  {
    label: 'State Diagram',
    icon: <Workflow className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Simple States',
        content: `@startuml
[*] --> State1
State1 --> [*]
State1 : this is a string
State1 --> State2 : Succeeded
State2 --> [*] : Aborted
@enduml`
      },
      {
        label: 'Composite & Choice',
        content: `@startuml
[*] --> Idle
state Processing {
  [*] --> Queueing
  Queueing --> Running : start
  Running --> [*] : done
}
Idle --> Processing : submit
Processing --> [*] : cancel

state ChoiceExample <<choice>>
Idle --> ChoiceExample
ChoiceExample --> Idle : invalid
ChoiceExample --> Processing : valid
@enduml`
      },
      {
        label: 'Concurrent Regions',
        content: `@startuml
[*] --> System
state System {
  state "UI" as UI {
    [*] --> Hidden
    Hidden --> Visible : show
    Visible --> Hidden : hide
  }
  --
  state "Network" as NET {
    [*] --> Disconnected
    Disconnected --> Connected : connect
    Connected --> Disconnected : drop
  }
}
@enduml`
      },
    ],
  },
  {
    label: 'Entity Relationship',
    icon: <Database className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Users & Posts',
        content: `@startuml
entity "User" as user {
  *id : number <<generated>>
  --
  *username : text
  *password : text
}

entity "Post" as post {
  *id : number <<generated>>
  --
  *user_id : number <<FK>>
  *content : text
}

user ||--o{ post
@enduml`
      },
      {
        label: 'Crow’s Foot Notation',
        content: `@startuml
entity Customer {
  *id
  --
  name
}

entity Order {
  *id
  --
  date
}

Customer ||--o{ Order : places
@enduml`
      },
      {
        label: 'Junction/Associative Entity',
        content: `@startuml
entity Student {
  *id
  --
  name
}
entity Course {
  *id
  --
  title
}
entity Enrollment {
  *student_id <<FK>>
  *course_id <<FK>>
  --
  grade
}

Student ||--o{ Enrollment
Course ||--o{ Enrollment
@enduml`
      },
    ],
  },
  {
    label: 'Component Diagram',
    icon: <Box className="w-4 h-4 mr-2" />,
    items: [
      {
        label: 'Packages & Nodes',
        content: `@startuml
package "Some Group" {
  HTTP - [First Component]
  [Another Component]
}

node "Other Groups" {
  FTP - [Second Component]
  [First Component] --> FTP
}

cloud {
  [Example 1]
}
@enduml`
      },
      {
        label: 'Provided/Required Interfaces',
        content: `@startuml
[WebApp] -down-> [API] : http
[API] -right-> [Database] : sql

[WebApp] ..> [Auth] : use
[API] ..> [Logger] : use
@enduml`
      },
      {
        label: 'Deployment (Node + Artifact)',
        content: `@startuml
node "Server" {
  artifact "app.jar" as app
}
node "DB" {
  database "postgres" as pg
}
app --> pg : jdbc
@enduml`
      },
    ],
  },
];
