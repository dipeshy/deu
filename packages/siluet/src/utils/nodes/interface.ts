import {
    InterfaceDeclaration,
} from 'typescript';
import {
    parseObjectType,
} from '../../parsers/typenode-parser';
import { getNameText } from './common';

export function toJsonSchema(node: InterfaceDeclaration) {
    return {
        [getNameText(node.name)]: {
            "$schema": "http://json-schema.org/draft-04/schema#",
            ...parseObjectType(node)
        },
    };
}
