using Yaapii.Atoms.Enumerable;

namespace BlazeKit.CLI.Tasks
{
    internal class TskWhen : ITask
    {
        private readonly Func<bool> condition;
        private readonly TskChain preperations;

        public TskWhen(Func<bool> condition, params ITask[] preperations) : this(
            condition,
            ManyOf.New(preperations)
        )
        { }

        public TskWhen(Func<bool> condition, IEnumerable<ITask> preperations)
        {
            this.condition = condition;
            this.preperations = new TskChain(preperations);
        }
        public Task Run()
        {
            return Task.Run(() =>
            {
                var task = Task.CompletedTask;
                if(condition())
                {
                    task = preperations.Run();
                }

                return task;
            });
        }
    }
}
