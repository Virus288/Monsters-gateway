import { RedisMemoryServer } from 'redis-memory-server';

export default class Mock {
  private _memoryServer: RedisMemoryServer | null = null;

  private get memoryServer(): RedisMemoryServer | null {
    return this._memoryServer;
  }

  async init(): Promise<void> {
    this._memoryServer = new RedisMemoryServer({
      instance: {
        port: 6378,
        ip: '127.0.0.1',
      },
      autoStart: false,
    });
    await this._memoryServer.start();
  }

  async getUrl(): Promise<string> {
    const host = await this.memoryServer!.getHost();
    const port = await this.memoryServer!.getPort();

    return `redis://${host}:${port}`;
  }

  async close(): Promise<void> {
    await this.memoryServer?.stop();
  }
}
