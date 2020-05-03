import {Pool} from 'pg';

const pool = new Pool({
    user: 'ag.riazanov',
    host: '127.0.0.1',
    database: 'game',
    password: '666666',
    port: 5432
});

export const query = async (command: string, params?: string[]): Promise<any> => {
    try {
        const client = await pool.connect();
        const startTime = Date.now();
        const result = await client.query(command, params);
        const duration = `${(Date.now() - startTime) / 1000} s`;
        console.log('executed query', {command, duration, rows: result.rowCount});
        client.release();
        return result.rows;
    } catch (err) {
        console.error(err.stack);
    }
};