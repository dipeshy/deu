import { NameType } from "./name";
import { Address } from "./address";

export interface Person {
    name: NameType;
    age: number;
    address: Address;
    points: string[];
    sex: 'male' | 'female';
    children: {
        infant: {
            name: string,
        },
        toddler: {
            name: string,
        }
    }
}
