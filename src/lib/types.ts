
export interface Post {
    id: string;
    title: string;
    content: string;
    region: string;
    authorId: string;
    authorName: string;
    authorPhotoURL?: string;
    createdAt: Date;
    likes?: string[]; // Array of user UIDs
    commentCount?: number;
}

export interface Comment {
    id: string;
    text: string;
    authorId: string;
    authorName: string;
    authorPhotoURL?: string;
    createdAt: Date;
}

export interface Diagnosis {
    id: string;
    userId: string;
    createdAt: Date;
    photoDataUri: string;
    additionalDetails?: string;
    diagnosis: string;
    treatmentSolutions: string;
    confidenceScore: number;
}
