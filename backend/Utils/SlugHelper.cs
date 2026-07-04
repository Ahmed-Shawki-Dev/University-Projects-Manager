using System.Text.RegularExpressions;

namespace backend.Utils
{
    public static class SlugHelper
    {
        public static string GenerateSlug(string slug)
        {
            if (string.IsNullOrWhiteSpace(slug))
                return string.Empty;

            var lowerPhrase = slug.ToLower().Trim();

            var words = lowerPhrase.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            var joinedWithHyphens = string.Join("-", words);

            var cleanChars = joinedWithHyphens
                .Where(c => char.IsLetterOrDigit(c) || c == '-')
                .ToArray();

            var finalCleanSlug = new string(cleanChars);

            string shortId = Guid.NewGuid().ToString().Substring(0, 6);

            return $"{finalCleanSlug.Trim('-')}-{shortId}";
        }
    }
}
