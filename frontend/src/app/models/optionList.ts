import { OptionValue } from "./optionValue";

export class OptionList {
    id: number = 0;
    name: string = '';
    ownerId?: number;
    optionValues: OptionValue[] = [];
}