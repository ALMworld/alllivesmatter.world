
export interface MegaFilesPack {
    hash?: string;
    blob_uri: string;
    blob?: Blob; // when blob_uri feteched set here
    files: { [key: string]: UnitFile };  // Corrected type definition
}

// add a method given an file_group, return ImageGroup
export interface UnitFile {
    base_name: string;
    range: number[];
    file_uri?: string // when ranged data converted  to image_uril: BlobImage
}
