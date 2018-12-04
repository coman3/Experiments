const typeName = "Vector";
export class Vector {
    x: number;
    y: number;

    private _type: string = typeName;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    DivideBy(value: number | Vector): Vector {
        const valueAsVector = value as Vector;
        const valueAsNumber = value as number;
        if ((value as Vector)._type === typeName) {
            return new Vector(this.x / valueAsVector.x, this.y / valueAsVector.y);
        }
        return new Vector(this.x / valueAsNumber, this.y / valueAsNumber);
    }

    Subtract(value: number | Vector): Vector {
        const valueAsVector = value as Vector;
        const valueAsNumber = value as number;
        if ((value as Vector)._type === typeName) {
            return new Vector(this.x - valueAsVector.x, this.y - valueAsVector.y);
        }
        return new Vector(this.x - valueAsNumber, this.y - valueAsNumber);
    }

    Add(value: number | Vector): Vector {
        const valueAsVector = value as Vector;
        const valueAsNumber = value as number;
        if ((value as Vector)._type === typeName) {
            return new Vector(this.x + valueAsVector.x, this.y + valueAsVector.y);
        }
        return new Vector(this.x + valueAsNumber, this.y + valueAsNumber);
    }

    Multiply(value: number | Vector): Vector {
        const valueAsVector = value as Vector;
        const valueAsNumber = value as number;
        if ((value as Vector)._type === typeName) {
            return new Vector(this.x * valueAsVector.x, this.y * valueAsVector.y);
        }
        return new Vector(this.x * valueAsNumber, this.y * valueAsNumber);
    }

    DistanceTo(value: Vector): number {
        return Math.sqrt(Math.pow(value.x - this.x, 2) + Math.pow(value.y - this.y, 2));
    }

    Invert() {
        return this.Multiply(-1);
    }

    Floor(): Vector {
        return new Vector(Math.floor(this.x), Math.floor(this.y));
    }
}