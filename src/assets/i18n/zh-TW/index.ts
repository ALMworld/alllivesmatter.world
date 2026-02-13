// Chinese (Traditional) — auto-generated locale — aggregates all JSON data into a single DataTypes export
import { DataTypes, AboutData } from '@/data/data_types';
import common from './common.json';
import advocacy from './advocacy.json';
import how from './how.json';
import why from './why.json';
import about from './about.json';

export const localeData: DataTypes = {
    ...common,
    advocacy_data: advocacy,
    how_data: how,
    why_data: why,
    about_data: about as AboutData,
} as DataTypes;

