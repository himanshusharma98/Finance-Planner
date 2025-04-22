using System.Security.Cryptography;
using System.Text;

namespace FinancePlanner.API.Helpers
{
    public static class PasswordHasher
    {
        public static string HashPassword(string password)
        {
            // Generate a random salt
            byte[] salt = RandomNumberGenerator.GetBytes(16); // 128-bit

            // Derive a 256-bit subkey using PBKDF2
            var hash = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] hashBytes = hash.GetBytes(32); // 256-bit hash

            // Combine salt + hash
            var combined = new byte[48];
            Array.Copy(salt, 0, combined, 0, 16);
            Array.Copy(hashBytes, 0, combined, 16, 32);

            return Convert.ToBase64String(combined);
        }

        public static bool VerifyPassword(string password, string storedHash)
        {
            byte[] hashBytes = Convert.FromBase64String(storedHash);
            byte[] salt = new byte[16];
            Array.Copy(hashBytes, 0, salt, 0, 16);

            var hash = new Rfc2898DeriveBytes(password, salt, 10000, HashAlgorithmName.SHA256);
            byte[] computedHash = hash.GetBytes(32);

            for (int i = 0; i < 32; i++)
            {
                if (hashBytes[i + 16] != computedHash[i])
                    return false;
            }

            return true;
        }
    }
}
