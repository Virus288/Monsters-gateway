import { knex } from 'knex';
import getConfig from '../tools/configLoader';
import Log from '../tools/logger';

class DbInit {
  private _client: knex.Knex | undefined;

  private get client(): knex.Knex {
    return this._client as knex.Knex;
  }

  private set client(value: knex.Knex) {
    this._client = value;
  }

  close(): void {
    this.client.destroy().catch(() => {
      // Ignored
    });
  }

  async init(): Promise<void> {
    this.initClient();

    try {
      await this.up();
    } catch (err) {
      try {
        Log.error('Init migrations up', 'Migration died. Incorrect db config ?. Trying rollback', err);
        await this.down();
      } catch (error) {
        Log.error('Init migrations', 'Migration died. Incorrect db config ?', error);
        this.close();
      }
    }

    this.close();
  }

  async up(): Promise<void> {
    await this.client.raw(`CREATE DATABASE IF NOT EXISTS \`${getConfig().mysql.db}\``);
    await this.client.raw(`ALTER DATABASE \`${getConfig().mysql.db}\` DEFAULT CHARSET=utf8 COLLATE utf8_general_ci`);
  }

  async down(): Promise<void> {
    await this.client.raw(`DROP DATABASE IF EXISTS \`${getConfig().mysql.db}\``);
  }

  private initClient(): void {
    this.client = knex({
      client: 'mysql2',
      connection: {
        host: getConfig().mysql.host,
        user: getConfig().mysql.user,
        password: getConfig().mysql.password,
        database: 'information_schema',
      },
      pool: {
        min: 10,
        max: 20,
      },
    });
  }
}

new DbInit().init().catch((err) => {
  Log.error('Init migrations', 'Migration died. Incorrect db config ?', err);
});
