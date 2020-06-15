import { } from 'typescript';
export function getNameText(nameTypeNode: any) {
    if (nameTypeNode && nameTypeNode.escapedText) {
        return nameTypeNode.escapedText;
    }
    return '';
}
