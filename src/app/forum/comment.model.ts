import { Profile } from "../profile/profile.model";

export interface Comment {
    id: string,
    tresc: string,
    autor: Profile,
    data: Date
}