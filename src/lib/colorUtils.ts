import { Vector3 } from 'three';

const rgbFromHex = (hex: string) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);

    return new Vector3(r, g, b);
};

export { rgbFromHex };
