namespace BlazeKit.Abstraction
{
    /// <summary>
    /// A reactive component is a component that can be updated/re-rendered.
    /// </summary>
    public interface IReactiveComponent
    {
        /// <summary>
        /// Update the component.
        /// </summary>
        void Update();
    }
}
