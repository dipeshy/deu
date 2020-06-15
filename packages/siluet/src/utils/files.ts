import {} from 'glob';
import { readFileSync } from 'fs';

export function scanTsFiles(rootDir: string) {
    
}

export function loadFile(path: string): string {
    return readFileSync(path, 'utf-8');
}