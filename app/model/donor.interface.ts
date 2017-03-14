export interface Donor {
    _id: string;
    fname: string;
    lname: string;
    contactNum: string;
    email: string;
    address?: {
        addr?: string;
        city?: string;
        state?: string;
        country?: string;
        pcode?: string;
    };
    bloodGroup: string;
    location?: {
        coordinates: number[];
        type: string;
    };
}