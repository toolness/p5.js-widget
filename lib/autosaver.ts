export interface Autosaver {
  restore(): string,
  save(value: string): void
}

export class SessionStorageAutosaver implements Autosaver {
  id: string

  constructor(id: string) {
    this.id = id;
  }

  save(value: string) {
    try {
      window.sessionStorage[this.id] = value;
    } catch (e) {
      // It's likely that we ran out of storage space or are in
      // private browsing mode or something. Regardless, autosave is
      // a parachute, so it's regrettable but ultimately not
      // catastrophic for us to fail here.

      console.log("Autosave for " + this.id + " failed", e);
    }
  }

  restore(): string {
    return window.sessionStorage[this.id];
  }
}
