using System.Windows;

namespace LargestCubesInCubeArray
{
    public struct RectangleInt
    {
        private Rect rect;
        public Vector2Int TopLeft => new Vector2Int((int)rect.TopLeft.X, (int)rect.TopLeft.Y);
        public Vector2Int TopRight => new Vector2Int(this.BottomRight.X, this.Y);
        public Vector2Int BottomRight => new Vector2Int((int)rect.BottomRight.X, (int)rect.BottomRight.Y);
        public Vector2Int BottomLeft => new Vector2Int(this.X, this.BottomRight.Y);
        public int X => TopLeft.X;
        public int Y => TopLeft.Y;
        public int Width => BottomRight.X - TopLeft.X;
        public int Height => BottomRight.Y - TopLeft.Y;

        public RectangleInt(int x, int y, int width, int height)
        {
            rect = new Rect(new Point(x, y), new Size(width, height));
        }

        public RectangleInt(Vector2Int topLeft, Vector2Int bottomRight)
        {
            rect = new Rect(new Point(topLeft.X, topLeft.Y), new Point(bottomRight.X, bottomRight.Y));
        }

        public bool Contains(Vector2Int position)
        {
            return rect.Contains(new Point(position.X, position.Y));
        }

        public override string ToString()
        {
            return $"X:{X} Y:{Y}, Width:{Width} Height:{Height}";
        }
    }
}