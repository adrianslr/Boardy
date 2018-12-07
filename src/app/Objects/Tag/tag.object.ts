export class Tag {
    objectId: String
    name: String 
    color: String

    public static exportable(tag: Tag) {
        return {
            "__type": "Pointer",
            "className": "Tags",
            "objectId": tag.objectId
        }
    }
}