using System.Net;
using Microsoft.AspNetCore.Html;
using Microsoft.AspNetCore.Mvc.Rendering;
using MyApp.ServiceModel.Types;
using ServiceStack.Text;

[assembly: HostingStartup(typeof(MyApp.ConfigureUi))]

namespace MyApp;

public class ConfigureUi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {
            appHost.CustomErrorHttpHandlers[HttpStatusCode.NotFound] = new RazorHandler("/NotFound");
            appHost.CustomErrorHttpHandlers[HttpStatusCode.Forbidden] = new RazorHandler("/Forbidden");
            
            // Populates @Html.Navbar() menu
            View.NavItems.AddRange(new List<NavItem> {
                new() { Href = "/",         Label = "Home",    Exact = true },
                new() { Href = "/Privacy",  Label = "Privacy" },
                new() { Href = "/TodoMvc",  Label = "Todo Mvc" },
                new() { Href = "/Contacts", Label = "Contacts", Show = "auth" },
                new() { Href = "/SignIn",   Label = "Sign In",  Hide = "auth" },
                new() { Href = "/Profile",  Label = "Profile",  Show = "auth" },
                new() { Href = "/Admin",    Label = "Admin",    Show = "role:Admin" },
            });
        });
}

public class AppData
{
    public readonly Dictionary<string, string> Colors = new() {
        {"#ffa4a2", "Red"},
        {"#b2fab4", "Green"},
        {"#9be7ff", "Blue"}
    };
    public readonly List<string> FilmGenres = EnumUtils.GetValues<FilmGenres>().Map(x => x.ToDescription());

    public readonly List<KeyValuePair<string, string>> Titles = EnumUtils.GetValues<Title>()
        .Where(x => x != Title.Unspecified)
        .ToKeyValuePairs();
}

public static class AppDataExtensions
{
    internal static readonly AppData Instance = new();

    public static Dictionary<string, string> ContactColors(this IHtmlHelper html) => Instance.Colors;
    public static List<KeyValuePair<string, string>> ContactTitles(this IHtmlHelper html) => Instance.Titles;
    public static List<string> ContactGenres(this IHtmlHelper html) => Instance.FilmGenres;
}
