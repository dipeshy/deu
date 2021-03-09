import {
    SyntaxKind,
    PropertySignature,
    TypeReferenceNode,
    ArrayTypeNode,
    TypeLiteralNode,
    InterfaceDeclaration,
    TypeNode,
    UnionTypeNode,
    LiteralTypeNode,
    isStringLiteral,
    isNumericLiteral,
    IntersectionTypeNode,
} from "typescript";
import { getNameText } from "../utils/nodes/common";
import { toKebabCase } from "../utils/string";

export type PropReturnType = 
 | { type: 'string' | 'number' | 'boolean' | 'null' }
 | { '$ref': string }
 | { type: 'array', items: any }
 | ObjectBodyType
 | any;
export function parseTypeNode(node: TypeNode): PropReturnType {
    switch(node.kind) {
        case SyntaxKind.AnyKeyword:
            return {};
        case SyntaxKind.StringKeyword:
            return { type: 'string' };
        case SyntaxKind.NumberKeyword:
            return { type: 'number' };
        case SyntaxKind.BooleanKeyword:
            return { type: 'boolean' };
        case SyntaxKind.NullKeyword:
            return { type: 'null' };
        case SyntaxKind.UndefinedKeyword:
            return { type: 'null' };
        case SyntaxKind.LiteralType:
            return parseLiteralType(node as LiteralTypeNode);
        case SyntaxKind.TypeLiteral:
            const typeLiteralNode = node as TypeLiteralNode;
            return parseObjectType(typeLiteralNode);
        case SyntaxKind.ArrayType:
            const arrayTypeNode = node as ArrayTypeNode;
            return {
                type: 'array',
                items: parseTypeNode(arrayTypeNode.elementType as TypeNode),
            };
        case SyntaxKind.TypeReference:
            return getReferenceBody(node as TypeReferenceNode);
        case SyntaxKind.UnionType:
            return parseUnionType(node as UnionTypeNode);
        case SyntaxKind.IntersectionType:
            return parseIntersectionType(node as IntersectionTypeNode);
        default:
            throw new Error('Unknown node kind: ' + node.kind);
    }
}
export function parseLiteralType(node: LiteralTypeNode) {
    if (isStringLiteral(node.literal)) {
        return {
            type: 'string',
            pattern: `^${node.literal.text}$`
        };
    } else if (isNumericLiteral(node.literal)) {
        return {
            type: 'number',
            minimum: parseInt(node.literal.text),
            maximum: parseInt(node.literal.text),
        };
    } else if (node.literal.kind === SyntaxKind.TrueKeyword
        || node.literal.kind === SyntaxKind.FalseKeyword
    ) {
        return {
            type: 'boolean'
        }
    }
    else {
        throw new Error('Unknown literal kind: ' + node.kind);
    }
}
export function parseUnionType(node: UnionTypeNode) {
    const values: any[] = node.types.map((n) => {
        return parseTypeNode(n);
    });

    return {
        oneOf: values,
    };
}

export function parseIntersectionType(node: IntersectionTypeNode) {
    const values: any[] = node.types.map((n) => {
        return parseTypeNode(n);
    });

    return {
        allOf: values,
    };
}

export function isRequiredProperty(node: PropertySignature) {
    return !(node.questionToken && node.questionToken.kind === SyntaxKind.QuestionToken)
}

export function getReferenceBody(node: TypeReferenceNode) {
    const name = getNameText(node.typeName);
    return { "$ref": toKebabCase(name) + '.json' };
}

export type ObjectBodyType = {
    type: "object";
    additionalProperties: boolean;
    required: string[]
    properties: {[key:string]: any}
}

export function parseObjectType(node: TypeLiteralNode | InterfaceDeclaration): ObjectBodyType {
    const required: string[] = [];
    const properties: {[key: string]: any} = {};
    let additionalProperties = false;

    node.members.forEach((node) => {
        if (node.kind === SyntaxKind.PropertySignature) {
            const prop = node as PropertySignature;
            const propName = getNameText(node.name);

            if (!prop.type) {
                return;
            }
            properties[propName] = parseTypeNode(prop.type);

            if (isRequiredProperty(prop)) {
                required.push(propName);
            }
        } else if (node.kind === SyntaxKind.IndexSignature) {
            additionalProperties = true;
        }
    });

    return {
        type: "object",
        additionalProperties,
        required,
        properties,
    }
}
