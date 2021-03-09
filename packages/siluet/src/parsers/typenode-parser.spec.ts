import { 
    LiteralTypeNode, TypeNode,
} from 'typescript';
import { parseTypeNode } from './typenode-parser';

describe('TypeNodeParser', () => {
    describe('Primitive types', () => {
        it('return string type', () => {
            expect(
                parseTypeNode({ kind: 143 } as TypeNode )
            ).toEqual({
                type: 'string',
            });
        });

        it('return number type', () => {
            expect(
                parseTypeNode({ kind: 140 } as TypeNode )
            ).toEqual({
                type: 'number',
            });
        });

        it('return boolean type', () => {
            expect(
                parseTypeNode({ kind: 128 } as TypeNode )
            ).toEqual({
                type: 'boolean',
            });
        });

        it('return null type', () => {
            expect(
                parseTypeNode({ kind: 100 } as TypeNode )
            ).toEqual({
                type: 'null',
            });
        });

        it('return undefined as null type', () => {
            expect(
                parseTypeNode({ kind: 146 } as TypeNode )
            ).toEqual({
                type: 'null',
            });
        });
    });

    describe('Literal types', () => {
        it('parses string literal types', () => {
            const result = parseTypeNode({
                kind: 187,
                literal: { kind: 10, text: 'foo' },
            } as LiteralTypeNode);
    
            expect(result).toEqual({
                type: 'string',
                pattern: '^foo$'
            })
        });
        it('parses number literal types', () => {
            const result = parseTypeNode({
                kind: 187,
                literal: { kind: 8, text: '5',},
            } as LiteralTypeNode);
    
            expect(result).toEqual({
                type: 'number',
                minimum: 5,
                maximum: 5,
            })
        });
        it('parses boolean literal types', () => {
            const result = parseTypeNode({
                kind: 187,
                literal: { kind: 106, },
            } as LiteralTypeNode);
    
            expect(result).toEqual({
                type: 'boolean'
            })
        });
    });

    describe('Object types', () => {
        it('parses object type with optional properties', () => {
            const data: unknown = {
                kind: 173,
                members: [
                    {
                        kind: 158,
                        name: {
                            kind: 75,
                            escapedText: "street"
                        },
                        type: { kind: 143 }
                    },
                    {
                        kind: 158,
                        name: {
                            kind: 75,
                            escapedText: "house"
                        },
                        questionToken: { kind: 57 },
                        type: { kind: 140 }
                    }
                ]
            };

            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                type: 'object',
                additionalProperties: false,
                required: ['street'],
                properties: {
                    street: {
                        type: 'string'
                    },
                    house: {
                        type: 'number'
                    }
                }
            });
        });

        it('parses object type with any properties', () => {
            const data: unknown = {
                kind: 173,
                members: [
                    {
                        kind: 158,
                        name: { kind: 75, escapedText: "firstname" },
                        type: { kind: 143 }
                    },
                    {
                        kind: 167,
                        parameters: [
                            {
                                kind: 156,
                                name: { kind: 75, escapedText: "key" },
                            }
                        ],
                        type: { kind: 143 }
                    }
                ]
            };

            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                type: 'object',
                additionalProperties: true,
                required: ['firstname'],
                properties: {
                    firstname: {
                        type: 'string'
                    }
                }
            });
        });
    });

    describe('Array types', () => {
        it('parses array of type string', () => {
            const data: unknown = {
                kind: 174,
                elementType: { kind: 143 }
            };

            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                type: 'array',
                items: {
                    type: 'string'
                }
            });
        });

        it('parses array of type object', () => {
            const data: unknown = {
                kind: 174,
                elementType: {
                    kind: 173,
                    members: [
                        {
                            kind: 158,
                            name: {
                                kind: 75,
                                escapedText: "firstname"
                            },
                            type: { kind: 143 }
                        }
                    ]
                },
            };

            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                type: 'array',
                items: {
                    type: 'object',
                    required: ['firstname'],
                    additionalProperties: false,
                    properties: {
                        firstname: { type: 'string'},
                    },
                }
            });
        });
    });

    describe('Union and intersection types', () => {
        it('parses union of string and number', () => {
            const data: unknown = {
                kind: 178,
                types: [
                    {
                        kind: 187,
                        literal: {
                            kind: 10,
                            text: 'five'
                        }
                    },
                    {
                        kind: 187,
                        literal: {
                            kind: 8,
                            text: '5'
                        }
                    }
                ]
            };
            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                oneOf: [
                    {type: "string", pattern: "^five$"},
                    {type: "number", maximum: 5, minimum: 5}
                ]
            });
        });
        it('parses intersection of objects', () => {
            const data: unknown = {
                kind: 179,
                types: [
                    {
                        kind: 173,
                        members: [
                            {
                                kind: 158,
                                name: {
                                    kind: 75,
                                    escapedText: "foo"
                                },
                                type: { kind: 143 }
                            }
                        ]
                    },
                    {
                        kind: 173,
                        members: [
                            {
                                kind: 158,
                                name: {
                                    kind: 75,
                                    escapedText: "bar"
                                },
                                type: { kind: 143 }
                            }
                        ]
                    },
                ]
            };

            const result = parseTypeNode(data as TypeNode);
            expect(result).toEqual({
                allOf: [
                    {
                        type: 'object',
                        additionalProperties: false,
                        required: ['foo'],
                        properties: {
                            foo: {
                                type: 'string'
                            },
                        }
                    },
                    {
                        type: 'object',
                        additionalProperties: false,
                        required: ['bar'],
                        properties: {
                            bar: {
                                type: 'string'
                            },
                        }
                    },
                ]
            });
        });
    });
});
