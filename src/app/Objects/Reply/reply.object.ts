import { User }         from "../User/user.object"

export class Reply {
    objectId: String
    createdAt: Date
    body: String
    author: User
}