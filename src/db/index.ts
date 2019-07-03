import * as config from 'config';
import { createConnection, Connection } from 'typeorm';
import { Tasks, Users, Comments } from '../models';

interface DBConnectionOptions {
  database: string;
  host: string;
  port: number;
  user: string;
  password: string;
}

const dbConfig = config.get<DBConnectionOptions>('connections.db');

class DB {
  private connection: Connection;

  async connect(): Promise<Connection> {

    if (this.connection) {
      return this.connection;
    }
    this.connection = await createConnection({
      type: 'postgres',
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
      entities: [
        Users,
        Tasks,
        Comments,
      ],
    });

    return this.connection;
  }
}

export const db = new DB();
