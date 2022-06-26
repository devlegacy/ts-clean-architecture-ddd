export abstract class EnvironmentArranger {
  abstract arrange(): Promise<void>
  abstract close(): Promise<void>
}
