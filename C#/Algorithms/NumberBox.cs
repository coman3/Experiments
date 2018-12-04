using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;

namespace Algorithms
{
    /// <summary>
    /// Interaction logic for NubmerBox.xaml
    /// </summary>
    public class NubmerBox : TextBox
    {

        public double Number => double.Parse(this.Text);
        public NubmerBox()
        {
            this.MaxLines = 1;
            this.Height = 22;
        }
        /// <summary>
        /// Copied from answer at: https://stackoverflow.com/questions/1268552/how-do-i-get-a-textbox-to-only-accept-numeric-input-in-wpf
        /// </summary>
        private static readonly Regex _regex = new Regex("[^0-9.-]+");
        /// <summary>
        /// Copied from answer at: https://stackoverflow.com/questions/1268552/how-do-i-get-a-textbox-to-only-accept-numeric-input-in-wpf
        /// </summary>
        private static bool IsTextAllowed(string text)
        {
            return !_regex.IsMatch(text);
        }

        protected override void OnPreviewTextInput(TextCompositionEventArgs e)
        {
            double value;
            if (IsTextAllowed(e.Text))
            {
                //success
                base.OnPreviewTextInput(e);
                return;
            }

            e.Handled = true;
            return;
        }
    }
}
