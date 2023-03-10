using Microsoft.AspNetCore.Mvc.Rendering;
using MyApp.ServiceModel.Types;

[assembly: HostingStartup(typeof(MyApp.ConfigureUi))]

namespace MyApp;

public class ConfigureUi : IHostingStartup
{
    public void Configure(IWebHostBuilder builder) => builder
        .ConfigureAppHost(appHost => {

            RazorPage.Config = new() {
                ForbiddenPartial = "~/Pages/Shared/Forbidden.cshtml", //Optional: Render partial in same page instead
            };

            // Populates @Html.Navbar() menu
            View.NavItems.AddRange(new List<NavItem> {
                new() { Href = "/Privacy",  Label = "Privacy"  },
                new() { Href = "/TodoMvc",  Label = "Todo Mvc" },
                new() { Href = "/Contacts", Label = "Contacts" },
                new() { Href = "/SignIn",   Label = "Sign In", Hide = When.IsAuthenticated },
                new() { Href = "/Profile",  Label = "Profile", Show = When.IsAuthenticated },
                new() { Href = "/Admin",    Label = "Admin",   Show = When.HasRole("admin") },
                new() { Href = "/auth/logout?continue=/", Label = "Sign Out", Show = When.IsAuthenticated },
            });
            
            //Referenced in Contacts.cs EvalAllowableEntries
            appHost.ScriptContext.Args[nameof(AppData)] = AppData.Instance;
        });
}

public class AppData
{
    public static readonly AppData Instance = new();

    public Dictionary<string, string> Colors { get; } = new() {
        {"#ffa4a2", "Red"},
        {"#b2fab4", "Green"},
        {"#9be7ff", "Blue"}
    };
    public List<string> FilmGenres { get; } = EnumUtils.GetValues<FilmGenre>().Map(x => x.ToDescription());

    public List<KeyValuePair<string, string>> Titles { get; } = EnumUtils.GetValues<Title>()
        .Where(x => x != Title.Unspecified)
        .ToKeyValuePairs();
}

public static class AppDataExtensions
{
    public static Dictionary<string, string> ContactColors(this IHtmlHelper html) => AppData.Instance.Colors;
    public static List<KeyValuePair<string, string>> ContactTitles(this IHtmlHelper html) => AppData.Instance.Titles;
    public static List<string> ContactGenres(this IHtmlHelper html) => AppData.Instance.FilmGenres;
}
