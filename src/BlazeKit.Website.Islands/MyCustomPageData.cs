using BlazeKit.Web;

namespace BlazeKit.Website
{

    public class Person
    {
        public string name { get; set; }
        public string height { get; set; }
        public string mass { get; set; }
    }

    public class MyCustomPageData : PageDataBase
    {
        public MyCustomPageData()
        {
            
        }
        public MyCustomPageData(Person person, DateTime date)
        {
            Person = person;
            Date = date;
        }
        public Person Person{ get; set; }
        public DateTime Date { get; set; }
    };
}
