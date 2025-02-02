declare namespace chrome
{
    namespace runtime
    {
      interface InstalledDetails
      {
        reason: "install" | "update" | "chrome_update" | "shared_module_update";
        previousVersion?: string;
        id?: string;
      }

        function onInstalled(callback: (details: InstalledDetails) => void): void;
    }
    namespace tabs
    {
      function query(queryInfo: any, callback: (result: any[]) => void): void;
    }
}


