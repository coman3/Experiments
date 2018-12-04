namespace LargestCubesInCubeArray
{
    public struct Vector2Int {

        public bool Equals(Vector2Int other)
        {
            return X == other.X && Y == other.Y;
        }

        public override bool Equals(object obj)
        {
            if (ReferenceEquals(null, obj)) return false;
            return obj is Vector2Int && Equals((Vector2Int) obj);
        }

        public override int GetHashCode()
        {
            unchecked
            {
                return (X * 397) ^ Y;
            }
        }

        public static Vector2Int Zero = new Vector2Int(0, 0);
        public static Vector2Int UnitX = new Vector2Int(1, 0);
        public static Vector2Int UnitY = new Vector2Int(0, 1);
        public static Vector2Int One = new Vector2Int(1, 1);

        public int X { get; set; }
        public int Y { get; set; }

        public Vector2Int(int x, int y)
        {
            X = x;
            Y = y;
        }

        public static Vector2Int operator +(Vector2Int c1, Vector2Int c2) => new Vector2Int(c1.X + c2.X, c1.Y + c2.Y);
        public static Vector2Int operator -(Vector2Int c1) => new Vector2Int(-c1.X, -c1.Y);
        public static Vector2Int operator -(Vector2Int c1, Vector2Int c2) => new Vector2Int(c1.X - c2.X, c1.Y - c2.Y);
        public static Vector2Int operator *(Vector2Int c1, Vector2Int c2) => new Vector2Int(c1.X * c2.X, c1.Y * c2.Y);
        public static Vector2Int operator /(Vector2Int c1, Vector2Int c2) => new Vector2Int(c1.X / c2.X, c1.Y / c2.Y);
        public static bool operator >(Vector2Int c1, Vector2Int c2) => c1.X > c2.X && c1.Y > c2.Y;
        public static bool operator <(Vector2Int c1, Vector2Int c2) => c1.X < c2.X && c1.Y < c2.Y;
        public static bool operator >=(Vector2Int c1, Vector2Int c2) => c1.X >= c2.X && c1.Y >= c2.Y;
        public static bool operator <=(Vector2Int c1, Vector2Int c2) => c1.X <= c2.X && c1.Y <= c2.Y;
        public static bool operator ==(Vector2Int c1, Vector2Int c2) => c1.X == c2.X && c1.Y == c2.Y;
        public static bool operator !=(Vector2Int c1, Vector2Int c2) => !(c1 == c2);
    }
}