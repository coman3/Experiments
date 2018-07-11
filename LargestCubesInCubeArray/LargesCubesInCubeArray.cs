using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Shapes;

namespace LargestCubesInCubeArray
{
    public class LargesCubesInCubeArray
    {
        public CubeItem[,] Cubes { get; set; }
        public List<RectangleInt> Rectangles { get; set; }

        public EventHandler OnComplete;
        public Stopwatch Stopwatch { get; set; }
        public bool HasCalulated { get; set; }
        public bool IsCalulating { get; set; }

        private int XBound => Cubes.GetUpperBound(0);
        private int YBound => Cubes.GetUpperBound(1);
        public Vector2Int Bounds => new Vector2Int(XBound, YBound);

        public LargesCubesInCubeArray(CubeItem[,] cubes)
        {
            Cubes = cubes;
            Rectangles = new List<RectangleInt>();
            Stopwatch = new Stopwatch();
        }


        public Vector2Int GetFirstWorkableCube()
        {
            for (int x = 0; x < XBound + 1; x++)
            {
                for (int y = 0; y < YBound + 1; y++)
                {
                    var cube = Cubes[x, y];
                    if (cube.IsFull) return new Vector2Int(x, y);
                }
            }

            return -Vector2Int.One;
        }

        private void Stop()
        {
            this.HasCalulated = true;
            this.IsCalulating = false;
            Console.WriteLine("Completed Calulate in: " + Stopwatch.ElapsedMilliseconds + "ms");
            Stopwatch.Stop();
            OnComplete?.Invoke(this, EventArgs.Empty);
        }

        private Vector2Int[] GetExpands(RectangleInt rectangle)
        {
            var nwExpand = rectangle.TopLeft - Vector2Int.One;
            var neExpand =  new Vector2Int(rectangle.BottomRight.X + 1, rectangle.Y - 1);
            var seExpand = rectangle.BottomRight + Vector2Int.One;
            var swExpand = new Vector2Int(rectangle.X - 1, rectangle.BottomRight.Y + 1);
            return new Vector2Int[] { nwExpand, neExpand, seExpand, swExpand};
        }

        private bool ContainsAllFull(RectangleInt rectangle)
        {
            for (int x = rectangle.X; x < rectangle.X + rectangle.Width; x++)
            {
                for (int y = rectangle.Y; y < rectangle.Y + rectangle.Height; y++)
                {
                    if (!Cubes[x, y].IsFull) return false;
                }
            }
            return true;
        }

        private RectangleInt ExpandRectangle(RectangleInt rectangle)
        {
            var expands = GetExpands(rectangle);

            var sucessfulyExpanded = false;
            var tempRectangle = new RectangleInt(expands[0], rectangle.BottomRight);
            if (expands[0] >= Vector2Int.Zero && expands[0] <= Bounds && ContainsAllFull(tempRectangle)) //TopLeft
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(new Vector2Int(rectangle.TopLeft.X, expands[1].Y), new Vector2Int(expands[1].X, rectangle.BottomRight.Y));
            if (expands[1] >= Vector2Int.Zero && expands[1] <= Bounds && ContainsAllFull(tempRectangle)) //TopRight
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(rectangle.TopLeft, expands[2]);
            if (expands[2] >= Vector2Int.Zero && expands[2] <= Bounds && ContainsAllFull(tempRectangle)) //BottomRight
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(new Vector2Int(expands[3].X, rectangle.TopLeft.Y), new Vector2Int(rectangle.BottomRight.X, expands[3].Y));
            if (expands[3] >= Vector2Int.Zero && expands[3] <= Bounds && ContainsAllFull(tempRectangle)) //BottomLeft
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }

            if (sucessfulyExpanded) return ExpandRectangle(rectangle);
            return rectangle;
        }

        public async Task CalulateAsync()
        {
            Stopwatch.Start();
            this.IsCalulating = true;

            //Calulate

            // Lets first get a cube to expand
            var cube = GetFirstWorkableCube();
            if (cube == -Vector2Int.One)
            {
                //whopsies, we got a lil poopie here, no cubes where found!
                MessageBox.Show("No Workable cubes found! Make sure you have generated them first");
                Stop();
                return;
            };

            // okay, we now have a cube, lets start a rectangle and expand it
            var rect = new RectangleInt(cube, cube);
            rect = ExpandRectangle(rect);
            Rectangles.Add(rect);
            
            Stop();
        }


    }
}