import * as dotenv from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
// __dirname is d:\alocacaoHoras\back-end\src\config
// We need to go up 3 levels to reach the project root.
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, '../../../.env');

dotenv.config({ path: envPath });