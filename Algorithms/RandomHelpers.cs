using System;

namespace Algorithms
{
    public static class RandomHelpers
    {
        private static Random random = new Random();
        public static int Random(int min, int max)
        {
            return random.Next(min, max);
        }

    }
}