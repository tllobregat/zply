import React from 'react';
import { FileCode, Activity, Share2, Database, Box, Workflow } from 'lucide-react';
import { PlantUmlSnippetGroup } from './plantuml.types';

export const getSnippetGroups = (t: (key: string) => string): PlantUmlSnippetGroup[] => [
  {
    id: 'sequence',
    icon: <Activity className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicRequestResponse',
        content: `@startuml
Alice -> Bob: ${t('contents.basicRequestResponse.request')}
Bob --> Alice: ${t('contents.basicRequestResponse.response')}

Alice -> Bob: ${t('contents.basicRequestResponse.anotherRequest')}
Alice <-- Bob: ${t('contents.basicRequestResponse.anotherResponse')}
@enduml`
      },
      {
        id: 'lifelinesActivation',
        content: `@startuml
actor ${t('contents.lifelinesActivation.user')}
participant "WebApp" as A
participant "API" as B

activate ${t('contents.lifelinesActivation.user')}
${t('contents.lifelinesActivation.user')} -> A: ${t('contents.lifelinesActivation.clickLogin')}
activate A
A -> B: POST /login
activate B
B --> A: 200 OK (token)
deactivate B
A --> ${t('contents.lifelinesActivation.user')}: ${t('contents.lifelinesActivation.loggedIn')}
deactivate A
@enduml`
      },
      {
        id: 'altOptLoop',
        content: `@startuml
participant Client
participant Server

Client -> Server: ${t('contents.altOptLoop.request')}
alt ${t('contents.altOptLoop.success')}
  Server --> Client: 200 OK
else ${t('contents.altOptLoop.error')}
  Server --> Client: 4xx/5xx
end

opt ${t('contents.altOptLoop.retry')}
  loop ${t('contents.altOptLoop.loopTimes')}
    Client -> Server: ${t('contents.altOptLoop.retryRequest')}
    Server --> Client: ${t('contents.altOptLoop.response')}
  end
end
@enduml`
      },
    ],
  },
  {
    id: 'class',
    icon: <Share2 className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'basicClassesComposition',
        content: `@startuml
class ${t('contents.basicClassesComposition.car')} {
  - String ${t('contents.basicClassesComposition.model')}
  - int ${t('contents.basicClassesComposition.year')}
  + void ${t('contents.basicClassesComposition.drive')}()
}

class ${t('contents.basicClassesComposition.engine')} {
  - int ${t('contents.basicClassesComposition.horsepower')}
}

${t('contents.basicClassesComposition.car')} *-- ${t('contents.basicClassesComposition.engine')}
@enduml`
      },
      {
        id: 'inheritanceInterfaces',
        content: `@startuml
interface ${t('contents.inheritanceInterfaces.repository')} {
  + ${t('contents.inheritanceInterfaces.save')}(entity)
  + ${t('contents.inheritanceInterfaces.findById')}(id)
}

abstract class ${t('contents.inheritanceInterfaces.baseEntity')} {
  + ${t('contents.inheritanceInterfaces.id')}: UUID
}

class ${t('contents.inheritanceInterfaces.user')} extends ${t('contents.inheritanceInterfaces.baseEntity')} {
  + ${t('contents.inheritanceInterfaces.name')}: String
}

class ${t('contents.inheritanceInterfaces.userRepository')} implements ${t('contents.inheritanceInterfaces.repository')}

${t('contents.inheritanceInterfaces.userRepository')} ..|> ${t('contents.inheritanceInterfaces.repository')}
${t('contents.inheritanceInterfaces.user')} --|> ${t('contents.inheritanceInterfaces.baseEntity')}
@enduml`
      },
      {
        id: 'associationsMultiplicity',
        content: `@startuml
class ${t('contents.associationsMultiplicity.order')}
class ${t('contents.associationsMultiplicity.orderLine')}
class ${t('contents.associationsMultiplicity.product')}

${t('contents.associationsMultiplicity.order')} "1" o-- "*" ${t('contents.associationsMultiplicity.orderLine')}
${t('contents.associationsMultiplicity.orderLine')} "*" --> "1" ${t('contents.associationsMultiplicity.product')}
@enduml`
      },
    ],
  },
  {
    id: 'useCase',
    icon: <FileCode className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'actorsBasic',
        content: `@startuml
left to right direction
actor "${t('contents.actorsBasic.foodCritic')}" as fc
rectangle ${t('contents.actorsBasic.restaurant')} {
  usecase "${t('contents.actorsBasic.eatFood')}" as UC1
  usecase "${t('contents.actorsBasic.payForFood')}" as UC2
  usecase "${t('contents.actorsBasic.drink')}" as UC3
}
fc --> UC1
fc --> UC2
fc --> UC3
@enduml`
      },
      {
        id: 'includeExtend',
        content: `@startuml
actor ${t('contents.includeExtend.customer')}
actor ${t('contents.includeExtend.admin')}

usecase "${t('contents.includeExtend.placeOrder')}" as U1
usecase "${t('contents.includeExtend.pay')}" as U2
usecase "${t('contents.includeExtend.validateCart')}" as U3
usecase "${t('contents.includeExtend.refund')}" as U4

U1 .> U3 : <<include>>
U1 .> U2 : <<include>>
U4 .> U2 : <<extend>>
${t('contents.includeExtend.customer')} --> U1
${t('contents.includeExtend.admin')} --> U4
@enduml`
      },
    ],
  },
  {
    id: 'state',
    icon: <Workflow className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'simpleStates',
        content: `@startuml
[*] --> State1
State1 --> [*]
State1 : ${t('contents.simpleStates.state1')}
State1 --> State2 : ${t('contents.simpleStates.succeeded')}
State2 --> [*] : ${t('contents.simpleStates.aborted')}
@enduml`
      },
      {
        id: 'compositeChoice',
        content: `@startuml
[*] --> ${t('contents.compositeChoice.idle')}
state ${t('contents.compositeChoice.processing')} {
  [*] --> ${t('contents.compositeChoice.queueing')}
  ${t('contents.compositeChoice.queueing')} --> ${t('contents.compositeChoice.running')} : ${t('contents.compositeChoice.start')}
  ${t('contents.compositeChoice.running')} --> [*] : ${t('contents.compositeChoice.done')}
}
${t('contents.compositeChoice.idle')} --> ${t('contents.compositeChoice.processing')} : ${t('contents.compositeChoice.submit')}
${t('contents.compositeChoice.processing')} --> [*] : ${t('contents.compositeChoice.cancel')}

state ChoiceExample <<choice>>
${t('contents.compositeChoice.idle')} --> ChoiceExample
ChoiceExample --> ${t('contents.compositeChoice.idle')} : ${t('contents.compositeChoice.invalid')}
ChoiceExample --> ${t('contents.compositeChoice.processing')} : ${t('contents.compositeChoice.valid')}
@enduml`
      },
      {
        id: 'concurrentRegions',
        content: `@startuml
[*] --> ${t('contents.concurrentRegions.system')}
state ${t('contents.concurrentRegions.system')} {
  state "${t('contents.concurrentRegions.ui')}" as UI {
    [*] --> ${t('contents.concurrentRegions.hidden')}
    ${t('contents.concurrentRegions.hidden')} --> ${t('contents.concurrentRegions.visible')} : ${t('contents.concurrentRegions.show')}
    ${t('contents.concurrentRegions.visible')} --> ${t('contents.concurrentRegions.hidden')} : ${t('contents.concurrentRegions.hide')}
  }
  --
  state "${t('contents.concurrentRegions.network')}" as NET {
    [*] --> ${t('contents.concurrentRegions.disconnected')}
    ${t('contents.concurrentRegions.disconnected')} --> ${t('contents.concurrentRegions.connected')} : ${t('contents.concurrentRegions.connect')}
    ${t('contents.concurrentRegions.connected')} --> ${t('contents.concurrentRegions.disconnected')} : ${t('contents.concurrentRegions.drop')}
  }
}
@enduml`
      },
    ],
  },
  {
    id: 'er',
    icon: <Database className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'usersPosts',
        content: `@startuml
entity "${t('contents.usersPosts.user')}" as user {
  *id : number <<generated>>
  --
  *${t('contents.usersPosts.username')} : text
  *${t('contents.usersPosts.password')} : text
}

entity "${t('contents.usersPosts.post')}" as post {
  *id : number <<generated>>
  --
  *user_id : number <<FK>>
  *${t('contents.usersPosts.content')} : text
}

user ||--o{ post
@enduml`
      },
      {
        id: 'crowsFoot',
        content: `@startuml
entity ${t('contents.crowsFoot.customer')} {
  *id
  --
  ${t('contents.crowsFoot.name')}
}

entity ${t('contents.crowsFoot.order')} {
  *id
  --
  ${t('contents.crowsFoot.date')}
}

${t('contents.crowsFoot.customer')} ||--o{ ${t('contents.crowsFoot.order')} : ${t('contents.crowsFoot.places')}
@enduml`
      },
      {
        id: 'junctionAssociative',
        content: `@startuml
entity ${t('contents.junctionAssociative.student')} {
  *id
  --
  ${t('contents.junctionAssociative.name')}
}
entity ${t('contents.junctionAssociative.course')} {
  *id
  --
  ${t('contents.junctionAssociative.title')}
}
entity ${t('contents.junctionAssociative.enrollment')} {
  *student_id <<FK>>
  *course_id <<FK>>
  --
  ${t('contents.junctionAssociative.grade')}
}

${t('contents.junctionAssociative.student')} ||--o{ ${t('contents.junctionAssociative.enrollment')}
${t('contents.junctionAssociative.course')} ||--o{ ${t('contents.junctionAssociative.enrollment')}
@enduml`
      },
    ],
  },
  {
    id: 'component',
    icon: <Box className="w-4 h-4 mr-2" />,
    items: [
      {
        id: 'packagesNodes',
        content: `@startuml
package "${t('contents.packagesNodes.someGroup')}" {
  HTTP - [${t('contents.packagesNodes.firstComponent')}]
  [${t('contents.packagesNodes.anotherComponent')}]
}

node "${t('contents.packagesNodes.otherGroups')}" {
  FTP - [${t('contents.packagesNodes.secondComponent')}]
  [${t('contents.packagesNodes.firstComponent')} ] --> FTP
}

cloud {
  [Example 1]
}
@enduml`
      },
      {
        id: 'providedRequired',
        content: `@startuml
[${t('contents.providedRequired.webApp')}] -down-> [${t('contents.providedRequired.api')}] : http
[${t('contents.providedRequired.api')}] -right-> [${t('contents.providedRequired.database')}] : sql

[${t('contents.providedRequired.webApp')}] ..> [${t('contents.providedRequired.auth')}] : ${t('contents.providedRequired.use')}
[${t('contents.providedRequired.api')}] ..> [${t('contents.providedRequired.logger')}] : ${t('contents.providedRequired.use')}
@enduml`
      },
      {
        id: 'deployment',
        content: `@startuml
node "${t('contents.deployment.server')}" {
  artifact "app.jar" as app
}
node "${t('contents.deployment.db')}" {
  database "${t('contents.deployment.postgres')}" as pg
}
app --> pg : jdbc
@enduml`
      },
    ],
  },
];
