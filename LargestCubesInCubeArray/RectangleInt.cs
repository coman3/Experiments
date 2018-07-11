namespace LargestCubesInCubeArray
{
    public struct RectangleInt
    {
        public Vector2Int TopLeft { get; set; }
        public Vector2Int TopRight => new Vector2Int(this.BottomRight.X, this.Y);
        public Vector2Int BottomRight { get; set; }
        public Vector2Int BottomLeft => new Vector2Int(this.X, this.BottomRight.Y);
        public int X => TopLeft.X;
        public int Y => TopLeft.Y;
        public int Width => BottomRight.X - TopLeft.X;
        public int Height => BottomRight.Y - TopLeft.Y;

        public RectangleInt(int x, int y, int width, int height)
        {
            TopLeft = new Vector2Int(x, y);
            BottomRight = new Vector2Int(x + width, y + height);
        }

        public RectangleInt(Vector2Int topLeft, Vector2Int bottomRight)
        {
            TopLeft = topLeft;
            BottomRight = bottomRight;
        }

        public override string ToString()
        {
            return $"X:{X} Y:{Y}, Width:{Width} Height:{Height}";
        }
    }
}