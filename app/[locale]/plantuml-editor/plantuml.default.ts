export const DEFAULT_PLANTUML: string = `@startuml
skinparam backgroundColor transparent
skinparam defaultFontName "Geist Mono"

actor Client
participant "Next.js" as App
participant "CheerpJ" as JVM

Client -> App : Modification code
App -> App : Debounce (3s)
App -> JVM : cjCall("convert")
JVM -> App : SVG String
App -> Client : Mise à jour UI
@enduml`;
