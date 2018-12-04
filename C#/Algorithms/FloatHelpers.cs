using System;

namespace Algorithms
{
    public static class FloatHelpers
    {
        public static float Map(this float value, float min1, float max1, float min2, float max2)
        {
            if (Math.Abs(max1 - min1) < float.Epsilon)
            {
                throw new ArithmeticException("/ 0");
            }
            float offset = min2;
            float ratio = (max2 - min2) / (max1 - min1);
            return ratio * (value - min1) + offset;
        }
    }
}