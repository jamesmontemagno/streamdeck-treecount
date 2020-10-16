using StreamDeckLib;
using StreamDeckLib.Messages;
using System;
using System.IO;
using System.Threading.Tasks;

namespace TestPlugin
{
    [ActionUuid(Uuid = "com.refractored.plugin.action.TreeCounterAction")]
    public class TreeCounterAction : BaseStreamDeckActionWithSettingsModel<Models.CounterSettingsModel>
    { 
        

        public override async Task OnKeyUp(StreamDeckEventPayload args)
        {
            SettingsModel.Counter += SettingsModel.Increase;


            await Manager.SetTitleAsync(args.context, SettingsModel.Counter.ToString());

            var path = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            path = Path.Combine(path, "TreeCounter");
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            path = Path.Combine(path, "count.txt");
            File.WriteAllText(path, $"Trees Planted: {SettingsModel.Counter}");

            //update settings
            await Manager.SetSettingsAsync(args.context, SettingsModel);
        }

        public override async Task OnDidReceiveSettings(StreamDeckEventPayload args)
        {
            await base.OnDidReceiveSettings(args);
            await Manager.SetTitleAsync(args.context, SettingsModel.Counter.ToString());
        }

        public override async Task OnWillAppear(StreamDeckEventPayload args)
        {
            await base.OnWillAppear(args);
            await Manager.SetTitleAsync(args.context, SettingsModel.Counter.ToString());
        }

    }
}
