
export type Role = "USER" | "ADMIN";

enum RelationShip {
    daughter = "딸",
    son = "아들",
    other = "직접 입력"
}
enum ServiceDuration {
    days = "3일",
    week = "1주일",
    month = "1달"
}

enum MemorialHallStatusEnum {
    public = "Public",
    private = "Private",
}
enum InquiryStatus {
    InProgress = "InProgress",
    Complete = "Complete",
}
enum FreeConsultationApplicationUserType {
    Empty = "Empty",
    Non = "Non",
    Standard = "Standard",
    Basic = "Basic",
    Premium = "Premium"
}
export {
    RelationShip,
    ServiceDuration,
    MemorialHallStatusEnum,
    InquiryStatus,
    FreeConsultationApplicationUserType
};