import { Profile } from "../profile/profile.model";
import { Comment } from "./comment.model";

export interface Post {
    id: string,
    tytul: string,
    tresc: string,
    autor: Profile,
    data_publikacji: Date,
    ocena: number,
    avatar: string,
    komentarze: Comment[]
} 