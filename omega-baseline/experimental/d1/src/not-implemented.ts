// Every unimplemented D1 port function throws this, naming the task that owns it.
// A gate that hits it is red for an honest reason the probe can show.
export class NotImplemented extends Error {
  constructor(public readonly task: string, what: string) {
    super(`NotImplemented[${task}]: ${what}`);
    this.name = "NotImplemented";
  }
}

export function notImplemented(task: string, what: string): never {
  throw new NotImplemented(task, what);
}
