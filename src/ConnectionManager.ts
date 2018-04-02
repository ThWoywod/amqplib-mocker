import { Connection } from './Connection';
export interface IConnectionManager {
  connect: (string) => Promise<Connection>;
}

export class ConnectionManager implements IConnectionManager {
  private connections: { [name: string]: Connection } = {};

  constructor() {}
  async connect(url: string) {
    return new Promise<Connection>((resolve, reject) => {
      if (!this.connections[url]) {
        this.connections[url] = new Connection();
      }
      resolve(this.connections[url]);
    });
  }
}