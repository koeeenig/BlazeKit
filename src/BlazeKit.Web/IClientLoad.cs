using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BlazeKit.Web
{
    internal interface IClientLoad
    {
        virtual void OnServerInit() { }
        virtual void OnMount() { }
    }
}
