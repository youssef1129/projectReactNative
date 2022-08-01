import { Idept } from "./Idept";

export interface Igroup{
    groupId: string|number;
    groupName: string;
    depts:Array<Idept>
}