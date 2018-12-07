import { User }         from "../User/user.object"
import { Tag }          from "../Tag/tag.object"

export class Talk {
    objectId: String
    createdAt: Date
    title: String 
    body: String
    author: User
    tag: Tag

    public static exportable(talk: Talk) {
        return {
            "__type": "Pointer",
            "className": "Talks",
            "objectId": talk.objectId
        }
    }

    public static mock() {
        let ret = new Talk()
        ret.objectId = "9999"
        ret.title = "Talk title"
        ret.body = "Body content"
        
        ret.author = new User()
        ret.author.avatar = "https://gravatar.com/avatar/82725eb2c32392f5c0338d4f0257ea1f?s=250"

        ret.tag = new Tag()

        return ret 
    }
}