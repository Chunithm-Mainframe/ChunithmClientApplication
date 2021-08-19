import { ReportFormConfiguration } from "../../Layer1/Configurations/@ReportFormConfiguration";

export class ReportFormModule {
    public static instantiate(config: ReportFormConfiguration): ReportFormModule {
        let module = new ReportFormModule();
        module._root = module;
        module._config = config;
        return module;
    }

    private _root: ReportFormModule = null;
    private _config: ReportFormConfiguration = null;

    private _modules: { [key: string]: ReportFormModule } = {};

    public getModule<TModule extends ReportFormModule>(factory: { name: string; new(): TModule }): TModule {
        if (factory.name in this._root._modules) {
            return this._root._modules[factory.name] as TModule;
        }
        const module = new factory();
        module._root = this._root;
        module._config = this._config;
        module.initialize();
        this._root._modules[factory.name] = module;
        return module;
    }

    protected initialize(): void { }

    protected get module(): ReportFormModule { return this._root; }

    public get configuration(): ReportFormConfiguration { return this._config; }
}
