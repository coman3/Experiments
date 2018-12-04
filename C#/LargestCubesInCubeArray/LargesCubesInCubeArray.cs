using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
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


        public Vector2Int GetFirstWorkableCubePosition()
        {

            for (int y = 0; y < YBound + 1; y++)
            {
                for (int x = 0; x < XBound + 1; x++)
                {
                    var cube = Cubes[x, y];
                    var pos = new Vector2Int(x, y);
                    if (cube.IsFull && !Rectangles.Any(r => r.Contains(pos)))
                        return pos;
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
            var neExpand = new Vector2Int(rectangle.BottomRight.X + 1, rectangle.Y - 1);
            var seExpand = rectangle.BottomRight + Vector2Int.One;
            var swExpand = new Vector2Int(rectangle.X - 1, rectangle.BottomRight.Y + 1);
            return new Vector2Int[] { nwExpand, neExpand, seExpand, swExpand };
        }

        private bool ContainsAllFullAndNotInRect(RectangleInt rectangle)
        {
            if (rectangle.TopLeft < Vector2Int.Zero || rectangle.BottomRight > Bounds) return false;
            for (int x = rectangle.X; x < rectangle.X + rectangle.Width; x++)
            {
                for (int y = rectangle.Y; y < rectangle.Y + rectangle.Height; y++)
                {
                    if (!Cubes[x, y].IsFull || Rectangles.Any(r => r.Contains(new Vector2Int(x, y))))
                        return false;
                }
            }
            return true;
        }

        private RectangleInt ExpandRectangle(RectangleInt rectangle)
        {
            var expands = GetExpands(rectangle);

            var sucessfulyExpanded = false;
            var tempRectangle = new RectangleInt(expands[0], rectangle.BottomRight);
            //TODO: Optimize this to search only the expanded area
            if (expands[0] >= Vector2Int.Zero && expands[0] <= Bounds && ContainsAllFullAndNotInRect(tempRectangle)) //TopLeft
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(new Vector2Int(rectangle.TopLeft.X, expands[1].Y), new Vector2Int(expands[1].X, rectangle.BottomRight.Y));
            if (expands[1] >= Vector2Int.Zero && expands[1] <= Bounds && ContainsAllFullAndNotInRect(tempRectangle)) //TopRight
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(rectangle.TopLeft, expands[2]);
            if (expands[2] >= Vector2Int.Zero && expands[2] <= Bounds && ContainsAllFullAndNotInRect(tempRectangle)) //BottomRight
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }
            tempRectangle = new RectangleInt(new Vector2Int(expands[3].X, rectangle.TopLeft.Y), new Vector2Int(rectangle.BottomRight.X, expands[3].Y));
            if (expands[3] >= Vector2Int.Zero && expands[3] <= Bounds && ContainsAllFullAndNotInRect(tempRectangle)) //BottomLeft
            {
                sucessfulyExpanded = true;
                rectangle = tempRectangle;
            }

            if (sucessfulyExpanded) return ExpandRectangle(rectangle);
            return rectangle;
        }

        public void CalulateAsync()
        {
            Stopwatch.Start();
            this.IsCalulating = true;

            //Calulate

            // Lets first get a cube to expand
            Vector2Int cubePosition = GetFirstWorkableCubePosition();
            if (cubePosition == -Vector2Int.One)
            {
                //whopsies, we got a lil poopie here, no cubes where found!
                MessageBox.Show("No Workable cubes found! Make sure you have generated them first");
                Stop();
                return;
            };

            while (cubePosition != -Vector2Int.One)
            {
                cubePosition = GetFirstWorkableCubePosition();
                var rect = new RectangleInt(cubePosition, cubePosition);
                rect = ExpandRectangle(rect);
                Rectangles.Add(rect);
            }



            // okay, we now have a cube, lets start a rectangle and expand it


            Stop();
        }


    }
}