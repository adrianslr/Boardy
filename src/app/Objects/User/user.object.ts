export class User {
    objectId: String
    email: String
    username: String 
    sessionToken: String
    admin: String
    avatar: String

    isAdmin(): Boolean {
        return this.admin == "true"
    }

    public static exportable(user: User) {
        return {
            "__type": "Pointer",
            "className": "_User",
            "objectId": user.objectId
        }
    }
}