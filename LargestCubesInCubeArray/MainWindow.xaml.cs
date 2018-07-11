using System;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using Algorithms;

namespace LargestCubesInCubeArray
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {

        public CubeItem[,] CubeItems { get; set; }
        public int Size => (int)SizeNumberBox.Number;
        public int NoiseFilter => (int)NoiseFilterNumberBox.Number;
        public FastNoise Noise { get; } = new FastNoise();

        public MainWindow()
        {
            InitializeComponent();
            Noise.SetNoiseType(FastNoise.NoiseType.SimplexFractal);
            Noise.SetFrequency(0.1f);
        }

        private void GenerateCubesButton_OnClick(object sender, RoutedEventArgs e)
        {
            if (Size > 256)
            {
                MessageBox.Show("Size must not be larger than 128", "Error", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            Clear();
            Noise.SetSeed(RandomHelpers.Random(0, int.MaxValue));
            CubeItems = new CubeItem[Size, Size];
            for (int x = 0; x < Size; x++)
            {
                for (int y = 0; y < Size; y++)
                {
                    var noiseValue = Noise.GetValue(x, y).Map(-1, 1, 0, 1000);
                    CubeItems[x, y] = new CubeItem()
                    {
                        IsFull = noiseValue > NoiseFilter
                    };
                }
            }

            DrawCubes();
        }


        private void DrawCubes()
        {
            var canvasWidth = DrawCanvas.ActualWidth;
            var canvasHeight = DrawCanvas.ActualHeight;

            var itemWidth = canvasWidth / Size;
            var itemHeight = canvasHeight / Size;

            for (int x = 0; x < Size; x++)
            {
                for (int y = 0; y < Size; y++)
                {
                    var cube = CubeItems[x, y];
                    var rect = new Border
                    {
                        Width = itemWidth,
                        Height = itemHeight,
                        Background = cube.IsFull ? Brushes.LightSeaGreen : Brushes.White,
                        BorderBrush = Brushes.Black,
                        BorderThickness = new Thickness(1),
                    };

                    Canvas.SetLeft(rect, x * itemHeight);
                    Canvas.SetTop(rect, y * itemHeight);
                    DrawCanvas.Children.Add(rect);
                }
            }
        }

        private void Clear()
        {
            DrawCanvas.Children.Clear();
        }

        private async void CalulateFull_OnClick(object sender, RoutedEventArgs e)
        {
            //Start the calulation
            var calulate = new LargesCubesInCubeArray(CubeItems);

            //TODO: Present Loading thingy

            calulate.OnComplete += (o, args) =>
            {
                var canvasWidth = DrawCanvas.ActualWidth;
                var canvasHeight = DrawCanvas.ActualHeight;

                var itemWidth = canvasWidth / Size;
                var itemHeight = canvasHeight / Size;
                foreach (var rectangle in calulate.Rectangles)
                {
                    MessageBox.Show("Found Rectangle: " + rectangle.ToString());
                    var rect = new Border
                    {
                        Width = (rectangle.Width) * itemWidth,
                        Height = (rectangle.Height) * itemHeight,
                        Background = new SolidColorBrush(Color.FromArgb(255 / 4, 255, 0, 0)),
                        BorderBrush = Brushes.Red,
                        BorderThickness = new Thickness(1),
                    };

                    Canvas.SetLeft(rect, rectangle.X * itemHeight);
                    Canvas.SetTop(rect, rectangle.Y * itemHeight);
                    DrawCanvas.Children.Add(rect);
                }
            };
            await calulate.CalulateAsync();
        }
    }


    public class CubeItem
    {
        public string Type { get; set; }
        public bool IsFull { get; set; }

    }
}
