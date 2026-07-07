using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services
{
    public class TokenService(IConfiguration configuration)
    {
        public string GenerateToken(List<Claim> claims)
        {
            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!)
            );

            var sc = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            if (!int.TryParse(configuration["JWT:ExpiryInDays"], out int expiryInDays))
            {
                expiryInDays = 7;
            }

            var token = new JwtSecurityToken(
                claims: claims,
                audience: configuration["JWT:Audience"],
                issuer: configuration["JWT:Issuer"],
                expires: DateTime.Now.AddDays(expiryInDays),
                signingCredentials: sc
            );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
