import {config} from 'dotenv';
config();

export const BD_HOST = process.env.BD_HOST || 'bwvoyynxz0cnet5rx2mk-mysql.services.clever-cloud.com';
export const BD_DATABASE = process.env.BD_DATABASE || 'bwvoyynxz0cnet5rx2mk';
export const BD_USER = process.env.BD_USER || 'uu0rwggf4nond0xd';
export const BD_PASSWORD = process.env.BD_PASSWORD || 'Q10UsMo6336QBuwSUlF5';
export const BD_PORT = process.env.BD_PORT || 3306;
export const PORT = process.env.PORT || 3000;