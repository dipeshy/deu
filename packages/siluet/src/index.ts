import * as ts from "typescript";
import { loadFile } from "./utils/files";
import { toJsonSchema } from "./utils/nodes/interface";
import { sync as globSync } from 'glob';
import { debug as _debug } from 'debug';
import { resolve } from 'path';
import { toKebabCase } from "./utils/string";
import { writeFileSync } from "fs";

const debug = _debug('siluet');

const workDir = resolve(__dirname, 'schema');

const sourceFiles = globSync('**/*.ts', {
    cwd: workDir,
});

debug('SourceFiles:', sourceFiles);

const schemas: any[] = sourceFiles.flatMap((file: string) => {
    const sourceFile = ts.createSourceFile(file, loadFile(resolve(workDir, file)), ts.ScriptTarget.ES2019);
    return handleSourceFile(sourceFile);
});
schemas.forEach((schema) => {
    Object.keys(schema).forEach((name) => {
        const outPath = resolve(workDir, toKebabCase(name) + '.json');
        writeFileSync(outPath, JSON.stringify(schema[name], null, 4));
        debug(`Saved ${name} schema as ${outPath}`);
    });
});

function handleSourceFile(node: ts.SourceFile) {
    const exportedInterfaceTypeNodes = node.statements.filter((node) => {
        return node.kind === ts.SyntaxKind.InterfaceDeclaration 
        && isExported(node as ts.InterfaceDeclaration);
    }) || [];

    const schemas = (exportedInterfaceTypeNodes as ts.InterfaceDeclaration[]).map(toJsonSchema);
    return schemas;
}

function isExported(node: ts.InterfaceDeclaration) {
    return (node.modifiers || []).some(({kind}) => {
        return kind === ts.SyntaxKind.ExportKeyword;
    });
}
