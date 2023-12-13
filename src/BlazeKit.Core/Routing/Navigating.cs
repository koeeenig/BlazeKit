// using BlazeKit.Reactivity.Signals;
// using Microsoft.AspNetCore.Components;
// using Microsoft.JSInterop;

// namespace BlazeKit.Core.Routing
// {
//     public class Navigating : SignalEnvelope<bool>
//     {
//         private readonly IDictionary<string,ScrollPosition> scrollPositions;
//         private readonly NavigationManager router;
//         private readonly IJSRuntime jsRuntime;

//         public Navigating() : base(true)
//         { }
//         public Navigating(NavigationManager router, IJSRuntime jsRuntime) : base(false)
//         {
//             scrollPositions = new Dictionary<string, ScrollPosition>();
//             if(router != null)
//             {
//                 router.RegisterLocationChangingHandler(async ctx =>
//                 {
//                     // strore scroll position
//                     var scrollPosition = await jsRuntime.InvokeAsync<ScrollPosition>("getScrollPosition");
//                     //Console.WriteLine($"Storing scroll position for {router.Uri}");
//                     scrollPositions[router.Uri] = scrollPosition;
//                     this.Value = true;
//                 });

//                 router.LocationChanged += (sender, args) =>
//                 {
//                     //// check if we have a scroll position for this route
//                     //if (scrollPositions.ContainsKey(args.Location))
//                     //{
//                     //    // restore scroll position
//                     //    var scrollPosition = scrollPositions[args.Location];
//                     //    jsRuntime.InvokeVoidAsync("setScrollPosition", scrollPosition.X, scrollPosition.Y);
//                     //}
//                     //Console.WriteLine(args.Location);
//                     this.Value = false;
//                 };
//             }

//             this.router = router;
//             this.jsRuntime = jsRuntime;
//         }

//         public void ApplyScrollPosition()
//         {
//             //Console.WriteLine($"Applying scroll position for {router.Uri}");
//             // check if we have a scroll position for this route
//             if (scrollPositions.ContainsKey(router.Uri))
//             {
//                 // restore scroll position
//                 var scrollPosition = scrollPositions[router.Uri];
//                 jsRuntime.InvokeVoidAsync("setScrollPosition", scrollPosition.X, scrollPosition.Y);
//             }
//         }

//         record ScrollPosition(float X, float Y);
//     }
// }
