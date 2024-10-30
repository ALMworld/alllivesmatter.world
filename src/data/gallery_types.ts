
export interface MegaFilesPack {
    hash?: string;
    env_prod: boolean;
    blob?: Blob; // when blob_uri feteched set here
    files: { [key: string]: UnitFile };  // Corrected type definition
}

export function getBlobUri(pack: MegaFilesPack): string {
    if (!pack.hash) return '';
    return pack.env_prod
        ? `https://assets.alllivesmatter.world/blobs/${pack.hash}.blob`
        : `./../public/${pack.hash}.blob`;
}


// add a method given an file_group, return ImageGroup
export interface UnitFile {
    base_name: string;
    range: number[];
    file_uri?: string // when ranged data converted  to image_uril: BlobImage
}
