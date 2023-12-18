namespace BlazeKit.CLI.Tasks
{
    internal abstract class TskEnveleope(Func<Task> preperation) : ITask
    {
        public Task Run()
        {
            return preperation();
        }
    }
}
