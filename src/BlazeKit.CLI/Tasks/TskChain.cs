using Yaapii.Atoms.Enumerable;

namespace BlazeKit.CLI.Tasks
{
    internal class TskChain : ITask
    {
        private readonly IEnumerable<ITask> preperations;

        public TskChain(params ITask[] preperations) : this(
            ManyOf.New(preperations)
        )
        {}

        public TskChain(IEnumerable<ITask> preperations)
        {
            this.preperations = preperations;
        }

        public Task Run()
        {
            return Task.Run(() =>
            {
                var tasks = new List<Task>();
                foreach (var prep in this.preperations)
                {
                    tasks.Add(prep.Run());
                }

                Task.WaitAll(tasks.ToArray());
            });
            
        }
    }
}
